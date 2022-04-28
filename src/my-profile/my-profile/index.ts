import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { useState } from 'react';
import { options, storage, UserAccount } from 'uione';
import { Client } from 'web-clients';
import { FileUploads } from '../../uploads/model';
import { MyProfileService, User, UserFilter, userModel, UserService, UserSettings } from './user';

export * from './user';

const httpRequest = new HttpRequest(axios, options);
const user: UserAccount = JSON.parse(sessionStorage.getItem('authService') || '{}') as UserAccount;
export class UserClient extends Client<User, string, UserFilter> implements UserService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, userModel);
    this.searchGet = true;
  }
  getUsersByRole(id: string): Promise<User[]> {
    const url = `${this.serviceUrl}?roleId=${id}`;
    return this.http.get<User[]>(url);
  }
}
export class MyProfileClient implements MyProfileService {
  constructor(private http: HttpRequest, private url: string) {
    this.getMyProfile = this.getMyProfile.bind(this);
    this.getMySettings = this.getMySettings.bind(this);
  }
  getMyProfile(id: string): Promise<User | null> {
    const url = this.url + '/' + id;
    return this.http.get<User>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  getMySettings(id: string): Promise<UserSettings | null> {
    const url = this.url + '/' + 'settings/' + id;
    return this.http.get<UserSettings>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }

  saveMySettings(id: string, settings: UserSettings): Promise<number> {
    return this.http.patch<number>(this.url + '/' + id + '/settings', settings).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
  saveMyProfile(data: User): Promise<number> {
    return this.http.patch<number>(this.url, data).catch(err => {
      const data = (err && err.response) ? err.response : err;
      console.log(data)
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }

  fetchImageUploaded(): Promise<FileUploads | null> {
    return this.http.get<FileUploads>(this.url + '/fetchImageUploaded/' + user.id).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  fetchImageUploadedGallery(): Promise<FileUploads[] | []> {
    return this.http.get<FileUploads[]>(this.url + '/fetchImageGalleryUploaded/' + user.id).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return [];
      }
      throw err;
    });
  }
}
export interface Config {
  myprofile_url: string;
}
class ApplicationContext {
  userService?: MyProfileService;
  getConfig(): Config {
    return storage.config();
  }
  getMyProfileService(): MyProfileService {
    if (!this.userService) {
      const c = this.getConfig();
      this.userService = new MyProfileClient(httpRequest, c.myprofile_url);
    }
    return this.userService;
  }

}

export const context = new ApplicationContext();
export function useGetMyProfileService(): MyProfileService {
  const [service] = useState(() => { return context.getMyProfileService() })
  return service;
}
