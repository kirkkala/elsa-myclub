import { useState } from 'react'
import { IconType } from 'react-icons'
import { LuPencil, LuList } from 'react-icons/lu'
import SelectField from '../SelectField/SelectField'
import TextInput from '../TextInput/TextInput'
import styles from './SelectOrInput.module.scss'

interface SelectOrInputProps {
  id: string
  label: string
  description: string
  Icon: IconType
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  teamPrefix: string
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
  description = '',
  Icon,
  options,
  placeholder,
  required,
  teamPrefix,
  switchText
}: SelectOrInputProps) {
  const [useCustomInput, setUseCustomInput] = useState(false);

  const stripPrefix = (name: string) => name.replace(`${teamPrefix} `, '');

  const displayOptions = [
    { value: "", label: "Valitse joukkue" },
    ...options.map(option => ({
      value: option.value,
      label: stripPrefix(option.value)
    }))
  ];

  const renderDescription = (switchProps: {
    text?: string,
    action: string,
    onClick: () => void
  }) => (
    <>
      {description}
      <div className={styles.switcher}>
        {switchProps.text && <span>{switchProps.text} </span>}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            switchProps.onClick();
          }}
        >
          {useCustomInput ? <LuList /> : <LuPencil />} {switchProps.action}
        </a>
      </div>
    </>
  );

  return (
    <div className={styles.selectOrInput}>
      {!useCustomInput ? (
        <SelectField
          id={id}
          label={label}
          className={styles.nestedField}
          description={renderDescription({
            text: switchText.toInput.text,
            action: switchText.toInput.action,
            onClick: () => setUseCustomInput(true)
          })}
          Icon={Icon}
          options={displayOptions}
          required={required}
          teamPrefix={teamPrefix}
        />
      ) : (
        <TextInput
          id={id}
          label={label}
          description={renderDescription({
            text: switchText.toList.text,
            action: switchText.toList.action,
            onClick: () => setUseCustomInput(false)
          })}
          Icon={Icon}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}
