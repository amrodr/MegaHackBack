global.SALT_KEY = 'f58877-ji839-12jidh-iej982uji08';
const port = process.env.MONGO_PORT || 27017;
const connection = 'mongodb://megahack:megahack123@ds157641.mlab.com:57641/megahack'

const options = {
    "useNewUrlParser": true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

module.exports = () => ({
    port,
    connection,
    options,
});
