"use client"

import React, { useState } from "react"
import * as Form from "@radix-ui/react-form"

interface PromptFormData {
  fullName: string
  jobTitle: string
  teamOrBusinessUnit: string
  departmentOrOrganisation: string
  additionalInfo: string
}

type FormFieldProps = {
  label: string
  name: keyof PromptFormData
  type?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FormField: React.FC<FormFieldProps> = ({ label, name, type = "text", onChange }) => (
  <Form.Field name={name}>
    <Form.Label htmlFor={name}>{label}</Form.Label>
    <input type={type} id={name} name={name} required onChange={onChange} placeholder={label} title={label} />
    <Form.Message />
  </Form.Field>
)

const PromptForm: React.FC = () => {
  const [_formData, setFormData] = useState<PromptFormData>({
    fullName: "",
    jobTitle: "",
    teamOrBusinessUnit: "",
    departmentOrOrganisation: "",
    additionalInfo: "",
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    // Here you can handle the form submission, e.g., sending the data to an API
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Form.Root onSubmit={handleSubmit}>
      <FormField label="Full Name" name="fullName" onChange={handleChange} />
      <FormField label="Job Title" name="jobTitle" onChange={handleChange} />
      <FormField label="Team or Business Unit Name" name="teamOrBusinessUnit" onChange={handleChange} />
      <FormField label="Department or Organisation Name" name="departmentOrOrganisation" onChange={handleChange} />

      <Form.Field name="additionalInfo">
        <Form.Label htmlFor="additionalInfo">Additional Information</Form.Label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          required
          onChange={handleChange}
          placeholder="Enter additional information"
          title="Additional Information"
        />
        <Form.Message />
      </Form.Field>

      <Form.ValidityState>{validity => <div>Form Validity: {validity ? "valid" : "invalid"}</div>}</Form.ValidityState>

      <button type="submit">Submit</button>
    </Form.Root>
  )
}

export default PromptForm
