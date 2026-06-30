import React from 'react';
import { UserProfilePage } from '@/pages/UserProfile';

// @ts-ignore
const someUntypedValue: any = { name: 'Vibe User' };

export default function ViolatingComponent() {
  const handleSave = () => {
    // Direct raw storage usage
    window.localStorage.setItem('vibe-username', 'Mama Vibe');
  };

  const getSecretKey = () => {
    // Hardcoded secret key
    const apiKey = 'secret-vibe-token-abcdef1234567890';
    return apiKey;
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h3>Vibe Coding Violator</h3>
      <button onClick={handleSave}>Save Name</button>
      {/* 
        This is a filler section to make this file exceed 150 lines 
        of code to trigger the soft-limit warning.
        Line 24
        Line 25
        Line 26
        Line 27
        Line 28
        Line 29
        Line 30
        Line 31
        Line 32
        Line 33
        Line 34
        Line 35
        Line 36
        Line 37
        Line 38
        Line 39
        Line 40
        Line 41
        Line 42
        Line 43
        Line 44
        Line 45
        Line 46
        Line 47
        Line 48
        Line 49
        Line 50
        Line 51
        Line 52
        Line 53
        Line 54
        Line 55
        Line 56
        Line 57
        Line 58
        Line 59
        Line 60
        Line 61
        Line 62
        Line 63
        Line 64
        Line 65
        Line 66
        Line 67
        Line 68
        Line 69
        Line 70
        Line 71
        Line 72
        Line 73
        Line 74
        Line 75
        Line 76
        Line 77
        Line 78
        Line 79
        Line 80
        Line 81
        Line 82
        Line 83
        Line 84
        Line 85
        Line 86
        Line 87
        Line 88
        Line 89
        Line 90
        Line 91
        Line 92
        Line 93
        Line 94
        Line 95
        Line 96
        Line 97
        Line 98
        Line 99
        Line 100
        Line 101
        Line 102
        Line 103
        Line 104
        Line 105
        Line 106
        Line 107
        Line 108
        Line 109
        Line 110
        Line 111
        Line 112
        Line 113
        Line 114
        Line 115
        Line 116
        Line 117
        Line 118
        Line 119
        Line 120
        Line 121
        Line 122
        Line 123
        Line 124
        Line 125
        Line 126
        Line 127
        Line 128
        Line 129
        Line 130
        Line 131
        Line 132
        Line 133
        Line 134
        Line 135
        Line 136
        Line 137
        Line 138
        Line 139
        Line 140
        Line 141
        Line 142
        Line 143
        Line 144
        Line 145
        Line 146
        Line 147
        Line 148
        Line 149
        Line 150
        Line 151
        Line 152
        Line 153
        Line 154
        Line 155
        Line 156
      */}
    </div>
  );
}
