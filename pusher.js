import Pusher from 'pusher';

const  pusher = new Pusher({
    appId: '1072199',
    key: '30c3abdca8d08e9b3117',
    secret: '2d2a808e76d88224f60c',
    cluster: 'mt1',
    encrypted: true
});

export default pusher;