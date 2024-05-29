<template>
  <div class="w-full bg-bgGrayLight pb-32 min-h-screen">
    <div class="relative w-full h-906 -mb-240 bg-no-repeat bg-cover bg-[url('./assets/headerBg.jpg')]">
      <div class="absolute w-600 top-200 en-GB:top-300 left-32 text-72">
        这是一个slogan，slogan
      </div>
      <p class="absolute top-600 left-32 text-24 text-grayLight">活动日期：{{ new Date().toISOString() }}</p>
    </div>
    <div class="relative mx-32 mt-32 px-32 py-64 bg-white rounded-12 text-24">模块1</div>
    <div class="relative mx-32 mt-32 px-32 py-64 bg-white rounded-12 text-24">模块2</div>
    <div class="relative mx-32 mt-32 px-32 py-64 bg-white rounded-12 text-24">模块3</div>
    <div class="relative mx-32 mt-32 px-32 py-64 bg-white rounded-12 text-24">模块4</div>
  </div>
</template>
