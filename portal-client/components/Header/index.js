import React from "react"
import { useEffect, useState } from "react"

export default function Header({account, status}){

    return(
        <header className="flex justify-end">
            <h1 className="bg-gray-400 rounded m-4 text-center p-4">{account || status}</h1>
        </header>
    )
}