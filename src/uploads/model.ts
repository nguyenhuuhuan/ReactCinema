export interface Uploads {
  userId: string;
  data: FileUploads[];
}
export interface FileUploads {
  source: string;
  type: string;
  url: string;
}

export interface Thumbnail {
  thumbnail?: string;
  standardThumbnail?: string;
  mediumThumbnail?: string;
  maxresThumbnail?: string;
  hightThumbnail?: string;
}
