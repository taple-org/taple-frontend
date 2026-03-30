export const useTimer = (initialTime: MaybeRefOrGetter<number>) => {
    const countdown = ref(toValue(initialTime));
    let timer: ReturnType<typeof setInterval> | null = null;

    function start() {
        countdown.value = toValue(initialTime);
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            if (countdown.value > 0) {
                countdown.value--;
            } else {
                clearInterval(timer!);
            }
        }, 1000);
    }

    onMounted(start);
    onUnmounted(() => { if (timer) clearInterval(timer); });

    return { countdown, restart: start };
};