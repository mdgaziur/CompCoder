import mongoose from 'mongoose';

type UType = {
    db: string
}

export default ({ db }: UType) => {
    const connect = () => {
        mongoose
            .connect(
                db,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            )
            .then(() => {
                console.log(`✔ - Connected to database at ${db}`);
            })
            .catch(error => {
                console.error(`❌ - Failed to connect to database: ${error}`);
                return process.exit(1);
            });
    }

    connect();

    mongoose.connection.on('disconnect', connect);
}