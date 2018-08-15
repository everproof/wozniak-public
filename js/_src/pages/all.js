route(function () {
    var $playVideo = $('#video-play-button, #watch-video');
    var videoID = $playVideo.data('video-id');
    var videoPlayer;
    var detailsCaptured = false;

    if(!videoID) return;

    window.onYouTubeIframeAPIReady = initialiseVideo;
    importYouTubeScript();
    $playVideo.on('click', onPlayClick);

    function onPlayClick() {
        if (!detailsCaptured) {
            Dialog.captureDetails().then(function() {
                detailsCaptured = true;
                Dialog.video();
            });
        } else {
            Dialog.video();
        }
    }

    function initialiseVideo() {
        videoPlayer = new YT.Player('youtube-player', {
            height: '720',
            width: '1280',
            videoId: videoID
        });
    }

    function importYouTubeScript() {
        var $youtubeScript = $('<script></script>');
        $youtubeScript.prop('src', 'https://www.youtube.com/iframe_api/');
        $youtubeScript.insertBefore($('script').first());
    }
});