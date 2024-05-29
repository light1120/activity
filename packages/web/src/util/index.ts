import { onUnmounted, ref } from 'vue'

export function useCountDown() {
    const countNum = ref(0)
    const countInterval = ref(0)

    const startCountDown = (num:number) => {
        countNum.value = Number(num)
        clearCountDown()
        countInterval.value = setInterval(() => {
            if (countNum.value === 0) {
                clearInterval(countInterval.value)
                countInterval.value = 0
                return
            }
            countNum.value--
        }, 1000)
    }

    const clearCountDown = () => {
        if (countInterval.value) {
            clearInterval(countInterval.value)
        }
    }

    onUnmounted(clearCountDown);

    return { countNum, startCountDown, clearCountDown }
}