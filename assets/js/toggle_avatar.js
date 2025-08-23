document.addEventListener('DOMContentLoaded', function() {

    var toggleBtn = document.getElementById('toggle-avatar-btn');
    var custom = document.getElementById('avatar-custom');
    var real = document.getElementById('avatar-real');
    var showingReal = false;

    // format toggle button
    function setToggleBtnMargin() {
        var avatar = custom.style.display !== 'none' ? custom : real;
        const funcSetMargin = function() {
            const width = avatar.offsetWidth;
            console.log(width);
            toggleBtn.style.width = width + "px";
        };
        if (avatar.complete) funcSetMargin();
        else avatar.onload = funcSetMargin;
    }
    setToggleBtnMargin();

    // toggle avatar
    function toggleAvatar() {
        showingReal = !showingReal;
        if (showingReal) {
            custom.style.display = 'none';
            real.style.display = 'block';
        } else {
            custom.style.display = 'block';
            real.style.display = 'none';
        }
    }
    if (toggleBtn && custom && real) {
        toggleBtn.addEventListener('click', toggleAvatar);
        custom.addEventListener('click', toggleAvatar);
        real.addEventListener('click', toggleAvatar);
    }


  });