import { test } from '@playwright/test'
import AntdFormHelper, { AntdInputType } from '../src/antd-form-helper'
import dayjs from 'dayjs'

test('', async ({ page }) => {
  await page.goto(
    'https://rekit.github.io/antd-form-builder/examples-v4/#basic'
  )

  await page.pause()

  const formHelper = new AntdFormHelper(page)
  await formHelper.fillFormValues([
    {
      label: 'Input',
      type: AntdInputType.InputText,
      value: 'lorem ipsum',
    },
    {
      label: 'Checkbox',
      type: AntdInputType.CheckboxGroup,
      value: {
        Apple: true,
        Orange: false,
        Banana: true,
      },
    },
    {
      label: 'Select',
      type: AntdInputType.Select,
      value: 'Orange',
    },
    {
      label: 'Radio Group',
      type: AntdInputType.RadioGroup,
      value: 'Banana',
    },
    {
      label: 'Radio Button Group',
      type: AntdInputType.RadioGroup,
      value: 'Orange',
    },
    {
      label: 'Password',
      type: AntdInputType.InputText,
      value: '123456',
    },
    {
      label: 'Textarea',
      type: AntdInputType.TextArea,
      value: 'lorem ipsum\nlorem ipsum\nlorem ipsum',
    },
    {
      label: 'Number',
      type: AntdInputType.InputText,
      value: '123.45',
    },
    {
      label: 'Date Picker',
      type: AntdInputType.DatePicker,
      value: dayjs().format('YYYY-MM-DD'),
    },
  ])

  await page.pause()
})
