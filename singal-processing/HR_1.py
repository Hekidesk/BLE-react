import scipy.signal as sg
from scipy import interpolate
import numpy as np

def HR_1(IR_data, time_axis):
    IR_data = np.array(IR_data)

    IR_data_ = IR_data - min(IR_data)

    vlocs, _ = sg.find_peaks(-IR_data_, distance=10)
    vvlas = np.take(IR_data_, vlocs)

    print(vlocs)
    print(vvlas)

    f = interpolate.interp1d(vlocs, vvlas, bounds_error=False, fill_value=True)
    n = np.arange(0, len(IR_data_))

    baseline = f(n)
    print(baseline)
    out_IR = IR_data_ - baseline
    thr = max(out_IR)/3

    print(thr)
    out_peaks, _ = sg.find_peaks(out_IR, distance=100, threshold=thr)
    HR_1 = len(out_peaks) / time_axis * 60

    return HR_1


print(HR_1([1, 2, 4, 5, -10,100,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100000,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 0.01))

