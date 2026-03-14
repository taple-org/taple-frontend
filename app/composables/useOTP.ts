type OTPVerifyPayload = {
    value: string[];
    valueAsString: string;
}

type UseOTP = {
    resend: () => void;
    countdown: Ref<number>;
    verify: (payload: OTPVerifyPayload) => Promise<void> | void;
    otp: Ref<string[]>;
}

export const useOTP = (
    duration: MaybeRefOrGetter<number>,
    onVerify: (payload: OTPVerifyPayload) => Promise<void> | void,
    onResend?: () => void,
): UseOTP => {
    const otp = ref<string[]>([]);
    const { countdown, restart } = useTimer(duration);

    function resend() {
        otp.value = [];
        if (onResend) onResend();
        restart();
    }

    return { otp, resend, countdown, verify: onVerify };
};