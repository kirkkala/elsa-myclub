import { useState } from "react"
import { IconType } from "react-icons"
import { LuPencil, LuList } from "react-icons/lu"
import SelectField from "../SelectField/SelectField"
import TextInput from "../TextInput/TextInput"
import styles from "./SelectOrInput.module.scss"

interface SelectOrInputProps {
  id: string
  label: string
  description?: string
  Icon: IconType
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  switchText: {
    toInput: {
      text?: string
      action: string
    }
    toList: {
      text?: string
      action: string
    }
  }
}

export default function SelectOrInput({
  id,
  label,
  description,
  Icon,
  options,
  placeholder,
  required,
  switchText,
}: SelectOrInputProps) {
  const [useCustomInput, setUseCustomInput] = useState(false)

  const displayOptions = [
    { value: "", label: "Valitse joukkue" },
    ...options.map((option) => ({
      value: option.value,
      label: option.value,
    })),
  ]

  const switchLink = (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        setUseCustomInput(!useCustomInput)
      }}
    >
      {useCustomInput ? <LuList /> : <LuPencil />}{" "}
      {useCustomInput ? switchText.toList.action : switchText.toInput.action}
    </a>
  )

  return (
    <div className={styles.selectOrInput}>
      {!useCustomInput ? (
        <SelectField
          id={id}
          label={label}
          className={styles.nestedField}
          description={description}
          Icon={Icon}
          options={displayOptions}
          required={required}
          suffix={switchLink}
        />
      ) : (
        <TextInput
          id={id}
          label={label}
          description={description}
          Icon={Icon}
          placeholder={placeholder}
          required={required}
          suffix={switchLink}
        />
      )}
    </div>
  )
}
