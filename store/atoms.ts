"use client";

import { atom } from 'recoil';

export const signatureMessageAtom = atom({
    key: 'signatureMessageAtom',
    default: '',
});