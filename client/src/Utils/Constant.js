// export const HOST = import.meta.env.VITE_SERVER_URL;
export const HOST = 'https://lockchat-app-live.onrender.com';

export const AUTH_ROUTES = 'api/auth';
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const SIGNIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/userInfo`; 
export const UPDATE_USER_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = 'api/contacts';
export const SEARCH_CONTACTS_ROUTES= `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES =`${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTES =`${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGE_ROUTES = 'api/messages';
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTES = `${MESSAGE_ROUTES}/upload-file`;

export const CHANNEL_ROUTES = 'api/channel';
export const CREATE_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTES= `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES_ROUTES= `${CHANNEL_ROUTES}/get-channel-messages`;

