/** @type {import('tailwindcss').Config} */

const maxWidth = 750
const spacing = {}
for (let i = 0; i <= maxWidth * 2; i++) {
  spacing[i] = `${i}px`
}
const fontSize = {}
for (let i = 12; i <= 100; i++) {
  // 这里同时设置了1.2倍的行高
  fontSize[i] = [`${i}px`, `${i * 1.2}px`]
}
const borderRadius = {}
for (let i = 1; i <= 750 / 2; i++) {
  // 这里同时设置了1.2倍的行高
  borderRadius[i] = `${i}px`
}

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 适用 padding, margin, width, height, min-xxx ,max-xxx等
      spacing,
      // 适用 font-size
      fontSize,
      // 适用 border-radius
      borderRadius,
      // 适用 color, background-color, border-color
      colors: {
        // 这里的命令明确使用场景，颜色，深浅
        red: 'red',
        grayLight: 'rgba(0, 0, 0, 0.54)', // 通用灰色浅色
        bgGrayLight: '#f5f5f5', // 背景灰色浅色
        linkBlueLight: '#828DD3', // 超链接蓝色浅色
      },
    },
  },
  plugins: [
    function ({ addVariant, e }) {
      addVariant('en-GB', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.en-GB .${e(`en-GB${separator}${className}`)}`
        })
      })
    },
  ],
}
