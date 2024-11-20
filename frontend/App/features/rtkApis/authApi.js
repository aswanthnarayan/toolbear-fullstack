import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: 'user/verify-email',
        method: 'POST',
        body: data,
      }),
    }), 
    createUser: builder.mutation({
      query: (data) => ({
        url: 'user/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),   
    
    signIn: builder.mutation({
      query: (data) => ({
        url: 'user/signin',
        method: 'POST',
        body: data,
      }),
    }),
    signUpGoogle: builder.mutation({
      query: (data) => ({
        url: 'user/signup-google',
        method: 'POST',
        body: data,
      }),
    }),
    completeGoogleSignup: builder.mutation({
      query: (data) => ({
        url: 'user/complete-google-signup',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPwemailVerification:builder.mutation({
      query:(data)=>({
        url:'user/forgot-password/verify-email',
        method:'POST',
        body:data,
      })
    })
    ,
    forgotPwOtpConfirm:builder.mutation({
      query:(data)=>({
        url:'user/forgot-password/verify-otp',
        method:'POST',
        body:data,
      })
    })
    ,
    createNewPw:builder.mutation({
      query:(data)=>({
        url:'user/forgot-password/change-password',
        method:'PATCH',
        body:data,
      })
    }),
    logOut:builder.mutation({
      query: (data) =>({
        url: '/user/logout',
        method: 'POST',
        body: data,
      })
    }),
  }),
  
});

export const { 
  useVerifyEmailMutation,
  useCreateUserMutation,
  useSignInMutation,
  useLogOutMutation,
  useSignUpGoogleMutation,
  useCompleteGoogleSignupMutation,
  useForgotPwemailVerificationMutation,
  useForgotPwOtpConfirmMutation,
  useCreateNewPwMutation
} = authApi;