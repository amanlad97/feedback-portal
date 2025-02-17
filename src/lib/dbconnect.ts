import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject ={}


export async function dbConnect(): Promise<void>{
    if (connection.isConnected){
        console.log('already connected')
        return
    }

    try {
      const db = await mongoose.connect(process.env.MONGODB_URL || '', {})
      connection.isConnected=db.connections[0].
      readyState
      console.log(db)
      console.log("successfully connected")

    }
    catch(error){
        console.log("Database failed",error)
    }
}