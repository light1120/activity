<template>
  <div class="w-full bg-bgGrayLight pb-32 min-h-screen">
    <div class="relative w-full h-906 -mb-240 bg-no-repeat bg-cover bg-[url('./assets/headerBg.jpg')]">
      <div class="absolute w-600 top-200 en-GB:top-300 left-32 text-72">
        这是一个slogan，slogan
      </div>
      <p class="absolute top-600 left-32 text-24 text-grayLight">活动日期：{{ new Date().toISOString() }}</p>
    </div>
    <div class="relative mx-32 mt-32 px-32 py-64 bg-white rounded-12 text-24">
      <h1 class="text-48 mb-24">欢迎登录</h1>
      <select
        v-model="gsmInfo.gsmCode"
        placeholder="请选择地域"
        class="w-300 h-60 text-32 mb-12 outline-none"
      >
        <option
          v-for="item in gsmInfo.gsmOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></option>
      </select>
      <div class="mb-12 relative">
        <input v-model="formData.phone" maxlength="20" class="w-full h-80 border-b-2 border-black focus:border-red outline-none text-32 placeholder:text-gray-300" placeholder="请输入手机号码" />
        <p class="mt-8 text-red font-12" v-if="formErrors.phone.error">{{ formErrors.phone.message }}</p>
      </div>
      <div class="mb-12 relative">
        <input v-model="formData.captcha" maxlength="6" class="w-full h-80 border-b-2 border-black focus:border-red  outline-none text-32 placeholder:text-gray-300" placeholder="请输入短信验证码" />
        <span class="absolute top-20 right-16 text-blue-400" @click="codeSend">发送验证码  {{ countNum == 0 ? '' : `: ${countNum}s`}}</span>
        <p class="mt-8 text-red font-12" v-if="formErrors.captcha.error">{{ formErrors.captcha.message}}</p>
      </div>
      <button class="w-full mt-32 h-100 bg-yellow-300 active:bg-yellow-400 rounded-16 text-32 text-normal" @click="loginSubmit"> 登录 </button>
    </div>
    <div class="relative mx-32 mt-32 px-32 py-64 bg-white rounded-12 text-24">模块2</div>
    <div class="relative mx-32 mt-32 px-32 py-64 bg-white rounded-12 text-24">模块3</div>
    <div class="relative mx-32 mt-32 px-32 py-64 bg-white rounded-12 text-24">模块4</div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import {  IFormValidation, useFormValidation } from './util/validation'
import { useCountDown } from './util';
const gsmInfo = reactive({
  gsmCode: '+86',
  gsmOptions:[{
        key: '+852',
        value: '+852',
        label: '中国香港 (+852)',
    },
    {
        key: '+86',
        value: '+86',
        label: '中国大陆 (+86)',
    }
  ],
})
interface IFormData {
  phone: string,
  captcha: string 
}
const validations:IFormValidation<IFormData> = {
    phone: {
        required: '请输入手机号码',
        phoneCN: {
            value: () => gsmInfo.gsmCode == '+86',
            message: '中国大陆手机号码不正确'
        },
        phoneHK: {
            value: () => gsmInfo.gsmCode != '+86',
            message: '中国香港手机号码不正确'
        }
    },
    captcha: {
        required: {
            value: true,
            message: '请输入短信验证码'
        },
        fixedNumber: {
            value: 6,
            message: '验证码错误，请重新输入'
        }
    }
}
const { formData, formErrors, handleSubmit } = useFormValidation<IFormData>(validations)
const { countNum, startCountDown } = useCountDown()
const codeSend = handleSubmit(async () => {
  startCountDown(60)
}, ['phone'])
const loginSubmit = handleSubmit(async () => {
    console.log('login submit')     
})
</script>
