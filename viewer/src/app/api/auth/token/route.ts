
import { getViewerToken } from "@/services/auth";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const access_token = await getViewerToken();
        return NextResponse.json({access_token});
    }catch (err){
        console.error('APS auth error:', err)
        return NextResponse.json(
            { error: 'Could not fetch APS viewer token' },
            { status: 500 },
        )
    }

}