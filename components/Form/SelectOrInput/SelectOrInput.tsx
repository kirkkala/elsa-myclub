import { useState } from "react"
import { LuPencil, LuList } from "react-icons/lu"
import SelectField from "../SelectField/SelectField"
import TextInput from "../TextInput/TextInput"
import styles from "./SelectOrInput.module.scss"
import { BaseFormFieldProps, SelectOption } from "../types"

interface SelectOrInputProps extends BaseFormFieldProps {
  options: SelectOption[]
  placeholder?: string
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
  options,
  disabled,
  ...props
}: SelectOrInputProps): React.ReactElement {
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
        if (!disabled) {
          setUseCustomInput(!useCustomInput)
        }
      }}
      className={disabled ? styles.disabled : ""}
    >
      {useCustomInput ? <LuList /> : <LuPencil />}{" "}
      {useCustomInput ? props.switchText.toList.action : props.switchText.toInput.action}
    </a>
  )

  return (
    <div className={styles.selectOrInput}>
      {!useCustomInput ? (
        <SelectField
          id={props.id}
          label={props.label}
          className={styles.nestedField}
          description={props.description}
          Icon={props.Icon}
          options={displayOptions}
          required={props.required}
          suffix={switchLink}
          onChange={props.onChange}
          disabled={disabled}
        />
      ) : (
        <TextInput
          id={props.id}
          label={props.label}
          description={props.description}
          Icon={props.Icon}
          placeholder={props.placeholder}
          required={props.required}
          suffix={switchLink}
          onChange={props.onChange}
          disabled={disabled}
        />
      )}
    </div>
  )
}
