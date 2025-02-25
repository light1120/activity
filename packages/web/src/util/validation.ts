import { reactive, watch } from 'vue'

// 内置的正则校验
const phoneCNRegExp = /^1[345789]\d{9}$/
const phoneHKRegExp = /^([6|9])\d{7}$/
const IdCNRegExp = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/
const IdHKRegExp = /^[A-Z]{1,2}[0-9]{6}[A0-9]$/
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

// 可支持的校验类型
type ValidationType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'fixedNumber'
  | 'phoneCN'
  | 'phoneHK'
  | 'IdCN'
  | 'IdHK'
  | 'email'
  | 'validation'

interface ValidationValue {
  value?: number | boolean | ((field?: string) => boolean)
  message: string | ((field?: string) => string)
}
type ValidationItem = {
  [key in ValidationType]?: ValidationValue
}
interface ValidationFun {
  value: (field?: string) => boolean
  message: string | ((field?: string) => string)
}
type IValidationBuiltFun = {
  [key in ValidationType]: (value: any) => (field: string) => boolean
}
interface IFormError {
  error: boolean
  message: string
}
export interface IFormOptions<T> {
  initFields?: Partial<T>
  always?: boolean
}
export type IFormValidation<T> = {
  [key in keyof T]: {
    [key in ValidationType]?: key extends 'required' ? ValidationValue | string : ValidationValue
  }
}
type IFormErrors<T extends Record<string, any>> = {
  [k in keyof T]: IFormError
}

const isEmpty = (value: unknown) => {
  if (typeof value == 'string') {
    return value.trim() == ''
  }
  return value == undefined || value == null
}
const checkFunc = (value: any | (() => any)) => {
  if (typeof value == 'function') {
    return value()
  } else {
    return value
  }
}

const ValidationBuiltinFunctions: IValidationBuiltFun = {
  required: (value) => (field: string) => (!checkFunc(value) ? true : !isEmpty(field)),
  minLength: (value) => (field: string) => !isEmpty(field) && field.trim().length >= value,
  maxLength: (value) => (field: string) => !isEmpty(field) && field.trim().length <= value,
  fixedNumber: (value) => (field: string) => new RegExp(`^\\d{${value}}$`).test(field),
  phoneCN: (value) => (field: string) => (!checkFunc(value) ? true : phoneCNRegExp.test(field)),
  phoneHK: (value) => (field: string) => (!checkFunc(value) ? true : phoneHKRegExp.test(field)),
  IdCN: (value) => (field: string) => (!checkFunc(value) ? true : IdCNRegExp.test(field)),
  IdHK: (value) => (field: string) => (!checkFunc(value) ? true : IdHKRegExp.test(field)),
  email: (value) => (field: string) => (!checkFunc(value) ? true : emailRegExp.test(field)),
  validation: (value: (field?: string) => boolean) => (field: string) => value(field),
}

export const useFormValidation = <T extends Record<string, any>>(
  validations: IFormValidation<T>,
  options?: IFormOptions<T>
) => {
  const _fields = Object.keys(validations) as (keyof T)[]
  // reactive 不需要传入范型
  const _formFields = reactive(Object.fromEntries(_fields.map((item) => [item, options?.initFields?.[item]]))) as T
  const _formErrors = reactive(
    Object.fromEntries(_fields.map((item) => [item, { error: false, message: '' }]))
  ) as IFormErrors<T>

  // 创建所以字段的，校验函数组
  const filterValidatorFunctions: Record<string, ValidationFun[]> = _fields.reduce((prev, field) => {
    const validation = validations[field]
    return {
      ...prev,
      [field]: Object.keys(validation).map((item) => {
        const vItem = validation[item as keyof ValidationItem]
        let value
        let message
        if (typeof vItem === 'string') {
          // 如果规则的值只是字符串，这转换成 { value: true , message : 规则字符串 }
          message = vItem
          value = true
        } else {
          value = vItem?.value || true
          message = vItem?.message
        }
        return {
          value: ValidationBuiltinFunctions[item as keyof ValidationItem](value), // Todo Type
          message: checkFunc(message),
        }
      }),
    }
  }, {})

  /**
   * @description 依此校验每个函数，全部通过返回 true , 不通过返回 false
   * @param field 字段
   * @returns
   */
  const validator = (field: string) => {
    // 获取校验函数组
    const functions = filterValidatorFunctions[field]
    let flag = true
    let index = 0
    // 依次校验
    while (!!functions[index] && functions[index].value(_formFields[field])) {
      index++
      // 成功就 +1
    }
    if (index != functions.length) {
      // 没有全部通过，取第一个没有通过的函数返回 message
      _formErrors[field].message = checkFunc(functions[index].message)
      _formErrors[field].error = true
      flag = false
    } else {
      // 全部通过
      _formErrors[field].error = false
      _formErrors[field].message = ''
    }
    return flag
  }

  /**
   * 监听字段修改，发生变换之后清楚error
   */
  _fields.forEach((field) => {
    watch(
      () => _formFields[field],
      (value, prevVal) => {
        if (options?.always) {
          _fields.forEach((item) => {
            validator(String(item))
          })
        } else if (value !== prevVal) {
          _formErrors[field].error = false
          _formErrors[field].message = ''
        }
      }
    )
  })
  /**
   * @description submit包装函数，默认校验所有的字段，也可以通过 fields 参数指定字段数组
   * @param submit
   * @param fields
   * @returns
   */
  const handleSubmit = (submit: () => Promise<any>, fields?: Array<keyof T>) => {
    const validateFields = fields || _fields
    return async (...argv: any) => {
      let result = true
      validateFields.forEach((item) => {
        const flag = validator(String(item))
        result = result && flag
      })
      return result ? await submit.apply(this, argv) : new Error(`validate ${validateFields.join(' ')} fail`)
    }
  }

  return { formData: _formFields, formErrors: _formErrors, handleSubmit }
}
