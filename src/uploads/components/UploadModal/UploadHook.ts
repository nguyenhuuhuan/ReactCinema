import axios from 'axios';
import * as React from 'react';
import { UserAccount } from 'uione';
import {config} from '../../../config'

const urlGetImg = 'http://localhost:8082/my-profile/image';
export interface State {
  success: boolean;
  loading: boolean;
}
const user: UserAccount = JSON.parse(sessionStorage.getItem('authService') || '{}') as UserAccount;
export const useUpload = () => {

  const [file, setFile] = React.useState<File>();
  const [state, setState] = React.useState<State>({
    success: false,
    loading: false
  });
  const upload = () => {
    if (file) {
      setState((pre) => ({ ...pre, loading: true }));
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      bodyFormData.append('id', user.id || '');
      bodyFormData.append('source', 'google-storage');
      const headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');
      return axios.post(config.authentication_url+"/my-profile/upload", bodyFormData, { headers }).then(async () => {
        setState((pre) => ({ ...pre, open: false, success: true, loading: false }));
        setFile(undefined);
      }).catch(() => {
        setState((pre) => ({ ...pre, loading: false }));
      });
    }
  };

  const uploadGallery = () => {
    if (file) {
      setState((pre) => ({ ...pre, loading: true }));
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      bodyFormData.append('id', user.id || '');
      bodyFormData.append('source', 'google-storage');
      const headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');
      return axios.post(config.authentication_url+"/my-profile/uploadGallery", bodyFormData, { headers }).then(async () => {
        setState((pre) => ({ ...pre, open: false, success: true, loading: false }));
        setFile(undefined);
      }).catch(() => {
        setState((pre) => ({ ...pre, loading: false }));
      });
    }
  };
  return { upload, file, setFile, state, setState ,uploadGallery};
};



export const getImageAvt = async () => {
  let urlImg = '';
  if (user) {
    try {
      const res = await axios
        .get(urlGetImg + `/${user.id}`);
      urlImg = res.data;
      return urlImg;
    } catch (e) {
      return urlImg;
    }
  }
};
export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/);
  let type = ''
  if (mime)
    type = mime[1]
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type });
};
