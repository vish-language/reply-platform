import { api } from "./axios";


export async function getGoogleConnection(){

    const response =
        await api.get(
            "/google-reviews/connection"
        );

    return response.data;

}



export async function connectGoogleReview(data:{
    locationId:string;
    accountEmail:string;
    accessToken:string;
    refreshToken:string;
    webhookSecret:string;
}){

    const response =
        await api.post(
            "/google-reviews/connect",
            data
        );


    return response.data;

}



export async function syncGoogleReviews(data:{
    locationId:string;
}){

    const response =
        await api.post(
            "/google-reviews/sync",
            data
        );


    return response.data;

}



export async function disconnectGoogleReview(){

    const response =
        await api.patch(
            "/google-reviews/disconnect"
        );


    return response.data;

}