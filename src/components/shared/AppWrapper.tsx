'use client'
import { loadUserFromStorage } from '@/store/slices/authSlice';
import { AppStore, makeStore } from '@/store/store';
import { ProgressProvider } from '@bprogress/next/app';
import React, { useEffect, useRef } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NuqsAdapter } from "nuqs/adapters/next/app";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  const InitAuthState = () => {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(loadUserFromStorage());
    }, [dispatch]);
    return null;
  };
  return (
    <Provider store={storeRef.current}>
      <InitAuthState />
      <NuqsAdapter>
      <ProgressProvider
        height="3px"
        color="#5B9A59"
        options={{ showSpinner: false }}
        shallowRouting>
        {children}
      </ProgressProvider>
      </NuqsAdapter>
    </Provider>
  )
}

export default AppWrapper