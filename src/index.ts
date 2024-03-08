import * as express from "express"
import { AppDataSource } from "./data-source"
import router from "./routes"
import * as cors from "cors"
import Env from "./utils/Env/Env"

AppDataSource.initialize()
    .then(async () => {
        const app = express()
        const PORT = Env.EXPRESS_PORT
        app.use(cors())

        app.use(express.json())
        app.use("/api/v1", router)

        app.listen(PORT, () => {
            console.log(`server started at http://localhost:${PORT}`)
        })

    }).
    catch(error => console.log(error))
