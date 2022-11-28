import scipy.signal as sg
from scipy import interpolate
import numpy as np
from js import createObject
from pyodide.ffi import create_proxy

def HR_1(IR_data, time_axis):

    IR_data_ = IR_data - IR_data.min()
    vlocs, _ = sg.find_peaks(-IR_data_, distance=10)
    vvlas = np.take(IR_data_, vlocs)

    f = interpolate.interp1d(vlocs, vvlas, bounds_error=False, fill_value=True)
    n = np.arange(0, len(IR_data_))

    baseline = f(n)
    out_IR = IR_data_ - baseline
    thr = max(out_IR)/3

    out_peaks, _ = sg.find_peaks(out_IR, distance=100, threshold=thr)
    HR_1 = len(out_peaks) / time_axis * 60

    return HR_1

def HR_1_Adapter(IR_data, time_axis):
    array = np.asarray(IR_data.to_py())
    return HR_1(array, time_axis)

createObject(create_proxy(HR_1_Adapter), "HR_1")
