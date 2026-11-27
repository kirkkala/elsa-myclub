"use client"

import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import DownloadIcon from "@mui/icons-material/Download"
import PeopleIcon from "@mui/icons-material/People"
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Box from "@mui/material/Box"
import MuiButton from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { useRef, useState } from "react"

import { API_CONNECTION_FAILED, API_CONVERSION_FAILED, API_FILE_MISSING } from "@/utils/error"
import type { MyClubExcelRow } from "@/utils/excel"

import groupsData from "../../../config/groups.json"
import Preview from "../../Preview/Preview"
import Button from "../Button/Button"
import FileUpload from "../FileUpload/FileUpload"
import IOSSwitch from "../IOSSwitch/IOSSwitch"
import SelectField from "../SelectField/SelectField"

// JSON body of the API routes; null when the server answered with something else
interface ApiResponse {
  data?: MyClubExcelRow[]
  message?: string
  fileName?: string
}

const readJson = (response: Response): Promise<ApiResponse | null> =>
  (response.json() as Promise<ApiResponse>).catch(() => null)

interface FormValues {
  files: File[]
  year: string
  duration: string
  meetingTime: string
  group: string
  eventType: string
  registration: string
}

const GROUP_OPTIONS = groupsData.groups.map((group) => ({ value: group }))

const buildFormData = (files: File[], values: FormValues): FormData => {
  const formData = new FormData()
  for (const file of files) {
    formData.append("files", file)
  }
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string" && value) {
      formData.append(key, value)
    }
  }
  return formData
}

// One preview request at a time. While a preview is refreshed after a settings
// change, the previous rows stay on screen (`loading` with rows).
type PreviewState =
  | { status: "idle" }
  | { status: "loading"; rows: MyClubExcelRow[] }
  | { status: "ready"; rows: MyClubExcelRow[] }
  | { status: "error"; message: string; fileName?: string }

export default function UploadForm() {
  const [preview, setPreview] = useState<PreviewState>({ status: "idle" })
  // Failure of something other than the preview: the download or the demo file
  const [actionError, setActionError] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoDialogOpen, setDemoDialogOpen] = useState(false)
  // The preview request in flight, so a newer one (or clearing the files) can cancel it
  const previewRequest = useRef<AbortController | null>(null)

  const currentYear = new Date().getFullYear()

  const [formValues, setFormValues] = useState<FormValues>({
    files: [],
    year: String(currentYear),
    duration: "90",
    meetingTime: "0",
    group: "",
    eventType: "Ottelu",
    registration: "Valituille henkilöille",
  })

  const previewData = "rows" in preview ? preview.rows : []
  const previewLoading = preview.status === "loading"
  const hasPreview = previewData.length > 0
  const error = preview.status === "error" ? preview.message : actionError
  const errorFileName = preview.status === "error" ? preview.fileName : undefined

  const fetchPreview = async (
    files: File[],
    values: FormValues,
    currentRows: MyClubExcelRow[] = []
  ): Promise<void> => {
    // Only the latest request may update the preview, so answers can't arrive out of order
    previewRequest.current?.abort()
    const request = new AbortController()
    previewRequest.current = request

    setActionError("")
    setPreview({ status: "loading", rows: currentRows })

    let result: PreviewState
    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        body: buildFormData(files, values),
        signal: request.signal,
      })
      const body = await readJson(response)

      result =
        response.ok && body?.data
          ? { status: "ready", rows: body.data }
          : {
              status: "error",
              message: body?.message || API_CONNECTION_FAILED,
              fileName: body?.fileName,
            }
    } catch {
      // fetch itself failed, e.g. no network connection
      result = { status: "error", message: API_CONNECTION_FAILED }
    }

    if (!request.signal.aborted) {
      setPreview(result)
    }
  }

  const clearPreview = (): void => {
    previewRequest.current?.abort()
    setPreview({ status: "idle" })
    setActionError("")
  }

  const handleFilesChange = (files: File[]): void => {
    setFormValues((prev) => ({ ...prev, files }))
    setIsDemoMode(false)

    if (files.length > 0) {
      void fetchPreview(files, formValues)
    } else {
      clearPreview()
    }
  }

  const handleFieldChange =
    (name: Exclude<keyof FormValues, "files">) =>
    (value: string): void => {
      const values = { ...formValues, [name]: value }
      setFormValues(values)

      if (values.files.length > 0) {
        void fetchPreview(values.files, values, previewData)
      }
    }

  const handleLoadDemo = async (): Promise<void> => {
    clearPreview()

    try {
      const response = await fetch("/elsa-demo.xlsx")
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const blob = await response.blob()
      const demoFile = new File([blob], "elsa-demo.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      setFormValues((prev) => ({ ...prev, files: [demoFile] }))
      setIsDemoMode(true)
      void fetchPreview([demoFile], formValues)
    } catch {
      setActionError("Demo-tiedoston lataus epäonnistui")
    }
  }

  const handleStopDemo = (): void => {
    clearPreview()
    setFormValues((prev) => ({ ...prev, files: [] }))
    setIsDemoMode(false)
  }

  const handleConfirmDemo = (): void => {
    setDemoDialogOpen(false)
    void handleLoadDemo()
  }

  const handleDownload = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setDownloading(true)
    setActionError("")

    try {
      if (formValues.files.length === 0) {
        setActionError(API_FILE_MISSING)
        return
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: buildFormData(formValues.files, formValues),
      })

      if (!response.ok) {
        setActionError((await readJson(response))?.message || API_CONVERSION_FAILED)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "elsa-myclub-import.xlsx"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch {
      // fetch itself failed, e.g. no network connection
      setActionError(API_CONNECTION_FAILED)
    } finally {
      setDownloading(false)
    }
  }

  const fileCount = formValues.files.length

  return (
    <Box sx={{ mb: 6 }}>
      <form>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          {isDemoMode ? (
            <Alert severity="info" sx={{ flex: 1, py: 0.5 }}>
              Demotila aktivoitu.
            </Alert>
          ) : (
            <Box />
          )}
          <FormControlLabel
            control={
              <IOSSwitch
                checked={isDemoMode}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDemoDialogOpen(true)
                  } else {
                    handleStopDemo()
                  }
                }}
              />
            }
            label={
              <Typography
                sx={{ fontSize: "0.9rem", color: "text.secondary", fontWeight: 500, mr: 1, mb: 0 }}
              >
                Demotila
              </Typography>
            }
            labelPlacement="start"
            sx={{ flexShrink: 0 }}
          />
        </Box>

        <Dialog
          open={demoDialogOpen}
          onClose={() => setDemoDialogOpen(false)}
          role="alertdialog"
          aria-labelledby="demo-dialog-title"
          aria-describedby="demo-dialog-description"
          maxWidth="xs"
        >
          <DialogTitle id="demo-dialog-title">Aktivoi demotila?</DialogTitle>
          <DialogContent>
            <DialogContentText id="demo-dialog-description" component="div">
              <Box component="p">
                Demotilassa lomakkeelle ladataan valmis esimerkkitiedosto{" "}
                <Link href="/elsa-demo.xlsx" download="elsa-demo.xlsx" sx={{ fontWeight: 500 }}>
                  elsa-demo.xlsx
                </Link>
                , jotta voit kokeilla muunninta ilman omaa eLSA-tiedostoa.
              </Box>
              <Box component="p">
                Huomaathan, että demotila on vain esimerkkitiedosto, voit kokeilla muunninta ilman
                omaa eLSA-tiedostoa, ja voit ladata muunnetun esimerkkitiedoston tietokoneellesi
                mutta älä käytä tiedostoa MyClubin tapahtumien tuomiseen.
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <MuiButton onClick={() => setDemoDialogOpen(false)}>Peruuta</MuiButton>
            <MuiButton onClick={handleConfirmDemo} variant="contained" autoFocus>
              Aktivoi demotila
            </MuiButton>
          </DialogActions>
        </Dialog>

        {isDemoMode && <Divider sx={{ my: 2 }} />}

        <FileUpload
          files={formValues.files}
          onFilesChange={handleFilesChange}
          label="eLSA Excel-tiedosto(t)"
          errorFileName={errorFileName}
          disabled={isDemoMode}
        />

        <Box sx={{ minHeight: 120, mb: 3, mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Virhe: Tiedoston prosessointi epäonnistui 🥴</AlertTitle>
              {error}
            </Alert>
          )}

          {previewLoading && !hasPreview && (
            <Alert severity="info" icon={<CircularProgress size={20} />}>
              Luetaan tiedostoa…
            </Alert>
          )}

          {hasPreview && !error && (
            <Alert severity="success" sx={{ mb: 4 }}>
              <AlertTitle>
                {isDemoMode
                  ? "Demo-Excelin lataus onnistui!"
                  : `${String(fileCount)} tiedosto${fileCount > 1 ? "a" : ""} luettu onnistuneesti!`}{" "}
                🎉
              </AlertTitle>
              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                <li>Säädä asetuksia ja esikatsele muunnosta sivun lopussa.</li>
                <li>
                  Lataa muunnettu tiedosto &quot;Lataa Excel&quot; -painikkeella omalle
                  tietokoneellesi.
                </li>
                <li>Mene MyClubiin ja tuo tapahtumat tiedostosta.</li>
              </Box>
            </Alert>
          )}
        </Box>

        <Box sx={{ display: hasPreview ? "block" : "none" }}>
          <SelectField
            id="group"
            Icon={PeopleIcon}
            label="1. Joukkue (MyClub ryhmä)"
            description="Etsi joukkue listalta tai kirjoita kuten se on MyClubissa."
            disableClearable={false}
            options={GROUP_OPTIONS}
            placeholder="Hae tai kirjoita joukkueen nimi"
            value={formValues.group}
            onChange={handleFieldChange("group")}
            freeSolo
          />

          <SelectField
            id="year"
            label="2. Vuosi"
            description="Valitse vuosi, eLSA:n tiedostossa ei ole vuotta päivämäärien yhteydessä."
            Icon={CalendarMonthIcon}
            options={[{ value: String(currentYear) }, { value: String(currentYear + 1) }]}
            value={formValues.year}
            onChange={handleFieldChange("year")}
          />

          <SelectField
            id="meetingTime"
            label="3. Kokoontumisaika"
            description="Voit valita kokoontumisajan lämppää varten, valinta aikaistaa tapahtuman alkamisaikaa."
            Icon={AccessTimeIcon}
            options={[
              { value: "0", label: "Ei aikaistusta" },
              { value: "15", label: "15 min ennen ottelun alkua" },
              { value: "30", label: "30 min ennen ottelun alkua" },
              { value: "45", label: "45 min ennen ottelun alkua" },
              { value: "60", label: "60 min ennen ottelun alkua" },
              { value: "75", label: "1 h 15 min ennen ottelun alkua" },
              { value: "90", label: "1 h 30 min ennen ottelun alkua" },
            ]}
            value={formValues.meetingTime}
            onChange={handleFieldChange("meetingTime")}
          />

          <SelectField
            id="duration"
            label="4. Tapahtuman kesto"
            Icon={AccessTimeIcon}
            options={[
              { value: "60", label: "1 tunti" },
              { value: "75", label: "1 tunti 15 minuuttia" },
              { value: "90", label: "1 tunti 30 minuuttia" },
              { value: "105", label: "1 tunti 45 minuuttia" },
              { value: "120", label: "2 tuntia" },
            ]}
            value={formValues.duration}
            onChange={handleFieldChange("duration")}
          />

          <SelectField
            id="eventType"
            label="5. Tapahtumatyyppi"
            Icon={SportsBasketballIcon}
            options={[{ value: "Ottelu" }, { value: "Muu" }]}
            value={formValues.eventType}
            onChange={handleFieldChange("eventType")}
          />

          <SelectField
            id="registration"
            label="6. Ilmoittautuminen"
            description="Valitse kenelle tapahtumaan ilmoittautuminen sallitaan MyClubissa."
            Icon={PeopleIcon}
            options={[
              { value: "Valituille henkilöille" },
              { value: "Ryhmän jäsenille" },
              { value: "Seuralle" },
            ]}
            value={formValues.registration}
            onChange={handleFieldChange("registration")}
          />
        </Box>
      </form>

      {hasPreview && (
        <>
          <Box
            aria-busy={previewLoading}
            sx={{ mt: 5, opacity: previewLoading ? 0.5 : 1, transition: "opacity 0.2s ease" }}
          >
            <Preview data={previewData} />
          </Box>

          <Box component="form" onSubmit={(e) => void handleDownload(e)} sx={{ mt: 3 }}>
            <Button
              type="submit"
              disabled={downloading}
              Icon={DownloadIcon}
              label="Lataa Excel"
              description={`Tallenna esikatselun mukainen Excel-tiedosto omalle
                tietokoneellesi, muokkaa tarvittaessa ja siirry MyClubiin tuomaan tapahtumat tiedostosta.`}
            >
              {downloading ? "Käsitellään..." : "Lataa Excel"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
