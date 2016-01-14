$(function() {    
    // This is a shortcut to bind both mouseOver and mouseOut
    $('.spotify-embed').hover(function() {
        console.log('hihi');
        // Animate out when hovered, stopping all previous animations
        $(this)
            .stop(true, false)
            .animate({
                left: 0
            }, 400);
    }, function() {
        // Animate back in when not hovered, stopping all previous animations
        $(this)
            .stop(true, false)
            .animate({
                left: -107
            }, 400);
    });
    
    $('.spotify-login').on('click', function() {
        console.log('hihi');
    })
    $('.spotifyPlaylistItem').click(function() {
        console.log('hihi', $(this));
    })
});