import { useState } from "react";

export const useFakeSignalFeed = (command = 0x07, callBack) => {
    const [timer, setTimer] = useState()

    const start = () => {
        const newTimer = setInterval(() => {
            callBack({
                ppg: Math.random(),
                ecg: Math.random(),
                force: Math.random()
            })
        }, 10)

        setTimer(newTimer)
    }

    const stop = () => {
        clearInterval(timer)
    }

    return {stop, start, isConnected: true}
}