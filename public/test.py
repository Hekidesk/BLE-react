from scipy.signal import *
import numpy as np

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
  ECG_filtered = filter(ECG_filtered1, 35, fs, 10, 'low')
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

  return HR

a = [
    265,
    246,
    283,
    174,
    266,
    354,
    214,
    272,
    141,
    211,
    85,
    221,
    639,
    633,
    98,
    160,
    289,
    154,
    103,
    -2,
    240,
    69,
    160,
    77,
    35,
    0,
    111,
    134,
    59,
    311,
    308,
    336,
    310,
    422,
    268,
    279,
    177,
    553,
    325,
    270,
    168,
    394,
    299,
    251,
    365,
    333,
    226,
    238,
    416,
    363,
    339,
    164,
    131,
    382,
    99,
    108,
    293,
    194,
    296,
    403,
    -13,
    330,
    490,
    494,
    153,
    143,
    230,
    152,
    57,
    205,
    -78,
    120,
    47,
    131,
    93,
    70,
    13,
    68,
    240,
    501,
    197,
    263,
    308,
    380,
    392,
    246,
    279,
    245,
    467,
    182,
    232,
    150,
    209,
    122,
    449,
    327,
    311,
    207,
    331,
    258,
    287,
    276,
    191,
    382,
    85,
    362,
    161,
    125,
    349,
    248,
    114,
    -148,
    397,
    738,
    247,
    329,
    159,
    243,
    194,
    84,
    179,
    228,
    -56,
    109,
    -23,
    -29,
    161,
    254,
    105,
    239,
    308,
    251,
    457,
    257,
    373,
    323,
    177,
    312,
    215,
    244,
    288,
    155,
    230,
    225,
    214,
    194,
    249,
    205,
    255,
    280,
    161,
    211,
    223,
    78,
    246,
    40,
    331,
    199,
    257,
    345,
    220,
    31,
    191,
    483,
    421,
    122,
    250,
    132,
    66,
    83,
    82,
    147,
    178,
    40,
    20,
    18,
    31,
    74,
    389,
    149,
    171,
    400,
    131,
    383,
    202,
    423,
    181,
    214,
    56,
    153,
    112,
    237,
    325,
    163,
    417,
    106,
    269,
    177,
    269,
    436,
    233,
    177,
    289,
    235,
    470,
    234,
    254,
    278,
    216,
    159,
    405,
    730,
    365,
    163,
    32,
    124,
    94,
    226,
    164,
    -50,
    187,
    74,
    47,
    -92,
    -1,
    33,
    319,
    358,
    288,
    246,
    334,
    449,
    381,
    152,
    167,
    253,
    123,
    322,
    307,
    154,
    267,
    157,
    348,
    158,
    270,
    159,
    285,
    120,
    292,
    292,
    222,
    244,
    190,
    117,
    369,
    200,
    169,
    108,
    110,
    491,
    468,
    311,
    118,
    80,
    139,
    310,
    40,
    -50,
    170,
    -36,
    -26,
    -110,
    51,
    -21,
    201,
    110,
    210,
    334,
    172,
    443,
    165,
    351,
    361,
    370,
    195,
    282,
    184,
    293,
    362,
    -11,
    254,
    195,
    102,
    553,
    226,
    297,
    234,
    323,
    222,
    286,
    100,
    300,
    309,
    185,
    146,
    310,
    128,
    -17,
    449,
    512,
    324,
    151,
    258,
    143,
    222,
    84,
    243,
    114,
    74,
    109,
    45,
    34,
    124,
    109,
    130,
    288,
    309,
    350,
    268,
    309,
    376,
    198,
    416,
    153,
    248,
    242,
    193,
    201,
    344,
    261,
    294,
    251,
    133,
    431,
    171,
    279,
    222,
    324,
    380,
    182,
    274,
    302,
    308,
    136,
    309,
    154,
    209,
    46,
    359,
    745,
    254,
    166,
    275,
    48,
    116,
    166,
    38,
    8,
    33,
    -20,
    105,
    -65,
    53,
    174,
    130,
    215,
    276,
    420,
    378,
    221,
    435,
    258,
    320,
    314,
    242,
    168,
    286,
    248,
    404,
    90,
    291,
    294,
    117,
    344,
    259,
    145,
    291,
    73,
    248,
    143,
    289,
    75,
    328,
    216,
    257,
    220,
    141,
    204,
    90,
    442,
    596,
    203,
    201,
    78,
    45,
    297,
    199,
    -12,
    213,
    14,
    -42,
    101,
    -131,
    185,
    87,
    217,
    188,
    182,
    431,
    346,
    356,
    222,
    265,
    447,
    433,
    192,
    257,
    228,
    348,
    153,
    281,
    98,
    396,
    189,
    331,
    197,
    243,
    174,
    291,
    282,
    321,
    71,
    155,
    101,
    197,
    916,
    464,
    247,
    -17,
    244,
    124,
    243,
    70,
    77,
    113,
    67,
    68,
    -10,
    -94,
    263,
    73,
    287,
    217,
    454,
    296,
    190,
    439,
    250,
    345,
    326,
    362,
    202,
    327,
    336,
    337,
    301,
    227,
    227,
    287,
    264,
    429,
    162,
    213,
    198,
    411,
    154,
    35,
    495,
    710,
    376,
    210,
    225,
    96,
    45,
    67,
    131,
    119,
    175,
    93,
    63,
    95,
    -6,
    103,
    184,
    241,
    204,
    380,
    332,
    315,
    519,
    182,
    268,
    206,
    403,
    245,
    236,
    285,
    225,
    257,
    227,
    195,
    143,
    286,
    90,
    343,
    264,
    287,
    147,
    239,
    118,
    365,
    746,
    459,
    274,
    271,
    120,
    71,
    225,
    85,
    253,
    180,
    153,
    40,
    106,
    -49,
    155,
    158,
    169,
    321,
    323,
    340,
    421,
    306,
    355,
    382,
    301,
    203,
    328,
    292,
    302,
    349,
    265,
    214,
    228,
    251,
    354,
    142,
    220,
    -25,
    367,
    86,
    286,
    163,
    117,
    252,
    594,
    678,
    96,
    280,
    179,
    2,
    100,
    114,
    205,
    58,
    234,
    57,
    17,
    44,
    39,
    80,
    140,
    280,
    93,
    241,
    276,
    311,
    237,
    264,
    174,
    254,
    310,
    210,
    303,
    143,
    185,
    335,
    260,
    251,
    247,
    300,
    288,
    197,
    193,
    227,
    223,
    242,
    180,
    154,
    -64,
    574,
    649,
    344,
    165,
    223,
    130,
    233,
    123,
    23,
    248,
    147,
    180,
    129,
    120,
    -75,
    172,
    308,
    269,
    542,
    283,
    479,
    358,
    431,
    415,
    416,
    533,
    354,
    343,
    305,
    459,
    288,
    458,
    523,
    331,
    514,
    155,
    460,
    313,
    544,
    394,
    337,
    387,
    199,
    164,
    854,
    518,
    438,
    232,
    296,
    366,
    354,
    138,
    223,
    165,
    194,
    227,
    190,
    13,
    112,
    381,
    179,
    342,
    371,
    450,
    603,
    414,
    442,
    412,
    468,
    327,
    263,
    356,
    297,
    392,
    370,
    457,
    294,
    352,
    459,
    474,
    180,
    380,
    273,
    487,
    334,
    181,
    558,
    807,
    326,
    379,
    131,
    301,
    273,
    126,
    450,
    87,
    219,
    40,
    393,
    -120,
    372,
    -80,
    105,
    249,
    283,
    186,
    146,
    289,
    246,
    444,
    32,
    251,
    211,
    13,
    378,
    176,
    237,
    443,
    392,
    383,
    478,
    517,
    344,
    563,
    465,
    544,
    369,
    325,
    651,
    803,
    422,
    405,
    275,
    266,
    296,
    264,
    301,
    236,
    172,
    123,
    111,
    373,
    319,
    202,
    278,
    435,
    308,
    451,
    431,
    341,
    440,
    177,
    332,
    294,
    312,
    472,
    282,
    295,
    483,
    158,
    292,
    285,
    93,
    334,
    303,
    88,
    362,
    225,
    134,
    451,
    739,
    493,
    72,
    245,
    206,
    165,
    125,
    56,
    253,
    128,
    26,
    -12,
    140,
    107,
    -22,
    250,
    290,
    256,
    378,
    380,
    264,
    235,
    295,
    287,
    284,
    349,
    319,
    166,
    398,
    159,
    400,
    240,
    173,
    276,
    487,
    258,
    362,
    312,
    272,
    137,
    149,
    183,
    492,
    625,
    265,
    311,
    238,
    113,
    226,
    188,
    43,
    150,
    138,
    181,
    236,
    125,
    141,
    247,
    229,
    343,
    412,
    426,
    260,
    341,
    465,
    448,
    271,
    256,
    357,
    375,
    263,
    445,
    269,
    332,
    427,
    296,
    344,
    273,
    229,
    356,
    310,
    383,
    282,
    185,
    391,
    518,
    751,
    360,
    281,
    195,
    177,
    247,
    305,
    87,
    184,
    348,
    80,
    177,
    49,
    269,
    265,
    175,
    316,
    348,
    402,
    344,
    355,
    430,
    121,
    344,
    465,
    427,
    285,
    330,
    285,
    470,
    372,
    312,
    362,
    247,
    448,
    253,
    406,
    342,
    -77,
    475,
    662,
    539,
    239,
    127,
    281,
    163,
    120,
    131,
    173,
    171,
    83,
    147,
    103,
    100,
    113,
    228,
    344,
    270,
    518,
    512,
    241,
    395,
    429,
    501,
    400,
    133,
    394,
    208,
    599,
    210,
    286,
    95,
    275,
    328,
    261,
    232,
    441,
    199,
    245,
    1,
    344,
    616,
    344,
    258,
    71,
    -44,
    22,
    -76,
    159,
    159,
    34,
    15,
    -217,
    63,
    193,
    48,
    111,
    209,
    192,
    511,
    259,
    431,
    344,
    205,
    289,
    260,
    307,
    136,
    354,
    125,
    99,
    248,
    47,
    341,
    101,
    195,
    244,
    168,
    308,
    357,
    13,
    24,
    543,
    622,
    58,
    -59,
    132,
    179,
    281,
    195,
    7,
    -6,
    35,
    43,
    17,
    -179,
    61,
    88,
    214,
    264,
    295,
    262,
    336,
    327,
    295,
    236,
    78,
    64,
    333,
    159
]

print(HeartBeat(a, 80))
