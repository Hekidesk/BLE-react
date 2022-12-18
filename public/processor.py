from scipy.signal import *
import numpy as np
from js import createObject
from pyodide.ffi import create_proxy

def filter(data, cutoff, fs, order, filter_type):
    nyq = fs / 2
    normal_cutoff = cutoff / nyq
    # Get the filter coefficients 
    b, a = butter(order, normal_cutoff, btype = filter_type, analog = False)
    y = filtfilt(b, a, data)
    return y

def HeartBeat(ECG, fs):
  dt = 1/ fs
  t = np.linspace(0, len(ECG)/fs, len(ECG), endpoint = True)
  ECG_filtered1 = filter(ECG, 5, fs, 10, 'high')
  ECG_filtered = filter(ECG_filtered1, fs / 2, fs, 10, 'low')
  z = ECG_filtered
  pos = z * (z>0)
  thr_R = (max(pos) + np.mean(pos)) / 3
  peaks, values = find_peaks(pos, height = thr_R)
  values = values['peak_heights']

  while True:
    NN = peaks[1:] - peaks[:-1]
    thr_OL = sum(np.sort(NN)[-3:-1]) / 6
    ou = np.where(NN < thr_OL)
    ou = ou[0][:]
    if ou.any():
      temp = np.min([values[ou].T,values[ou+1].T] , axis=0)
      for i in range(len(temp)):
        peaks = peaks[values != temp[i]]
        values = values[values != temp[i]]
    else: break

  while True:
    NN = peaks[1:] - peaks[:-1]
    thr_OL = np.mean(NN) * 1.5
    ou = np.where(NN > thr_OL)
    ou = ou[0][:]
    if ou.any():
      temp = np.min([values[ou].T,values[ou+1].T] , axis=0)
      for i in range(len(temp)):
        peaks = peaks[values != temp[i]]
        values = values[values != temp[i]]
    else: break

  peak_times = t[peaks]
  period = np.mean(peak_times[1:] - peak_times[:-1])
  HR = 60 / period

  print("Here")
  print(HR)
  return HR

def HeartBeat_Adapter(ECG_data, sample_duration):
    array = np.asarray(ECG_data.to_py())
    fs = len(array) / sample_duration
    return HeartBeat(array, fs)

createObject(create_proxy(HeartBeat_Adapter), "HeartBeat")
