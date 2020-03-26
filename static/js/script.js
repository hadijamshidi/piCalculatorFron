document.body.onload = initialWeb;
let posts = [];
const postsStorageKey = 'postsFromSession';
const programsStorageKey = 'programsFromSession';
const infoStorageKey = 'infoFromSession';

function initialWeb() {
    // registerSW();
    // initVideos();
    changeColor();
    // initPrograms();
    initInfo();
    move2hash();
}

function move2hash(sectionId = null) {
    sectionId = sectionId || window.location.hash.replace('#', '');
    if (['hero', 'calculator', 'about', 'contact'].indexOf(sectionId) > -1) {
        document.getElementById('refer2' + sectionId).click();
    }
}

function changeColor() {
    document.querySelector('#main > a.color-scheme.hide.text-white.bg-base-color.d-inline-block > i').click();
}

function setPosts(givenPosts) {
    let div = document.getElementById("posts-rows");
    div.innerHTML = "";
    let postCounter = 0;
    posts = givenPosts;
    posts.forEach(function (post) {
        let post_div = '' +
            '                        <div class="col-lg-4">\n' +
            '                            <div class="blog-item box-border">\n' +
            '                                <div class="blog-image">\n' +
            '                                    <div class="blog-intro">\n' +
            '                                        <img alt="/" src="' + post['cover'] + '">\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                                <div class="blog-content">\n' +
            '                                    <ul class="list-inline mt-4">\n' +
            '                                        <li class="list-inline-item">\n' +
            '                                            <i class="lni-calendar base-color"></i>\n' +
            '                                            <span class="text-muted">' + post['date'] + ' </span>\n' +
            '                                        </li>\n' +
            // '                                        <li class="list-inline-item">\n' +
            // '                                            <i class="lni-comment base-color"></i>\n' +
            // '                                            <span class="text-muted">8</span>\n' +
            // '                                        </li>\n' +
            '                                    </ul>\n' +
            '                                    <h5 class="mb-3"><a class="text-dark" data-target="#blog-single" data-toggle="modal"\n' +
            '                                                        href="javascript:void(0)" target="_blank" onclick="postPreview(' + postCounter + ')">' + post['title'] + '</a></h5>\n' +
            '                                    <p>' + post['shortDescription'] + '</p>\n' +
            '                                    <div class="blog-link">\n' +
            '                                        <a class="base-color" data-target="#blog-single" data-toggle="modal"\n' +
            '                                           href="javascript:void(0)" target="_blank" onclick="postPreview(' + postCounter + ') ">' +
            'تماشا کنید</a>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                        </div>\n';
        div.innerHTML += post_div;
        postCounter += 1;
    })
}

function initVideos() {
    if (navigator.onLine) {
        $.ajax({
            url: '/api/posts',
            method: 'GET',
            success: function (response) {
                setPosts(response.posts);
                sessionStorage.setItem(postsStorageKey, JSON.stringify(response.posts));
            },
            error: function (e) {
                console.log(e);
            }
        });
    } else {
        setPosts(JSON.parse(sessionStorage.getItem(postsStorageKey)));
    }
}

function postPreview(postID) {
    document.getElementById('blogModalScrollable').innerHTML = posts[postID]['category'];
    document.getElementById('blogModalScrollableTitle').innerHTML = posts[postID]['title'];
    document.getElementById('blogModalScrollableWatchPost').innerHTML = posts[postID]['div'];
    document.getElementById('blogModalScrollableFullDescription').innerHTML = posts[postID]['fullDescription'];
    document.getElementById('blogModalScrollablePostDateAndAuthor').innerHTML = posts[postID]['date'] + '، ' + posts[postID]['author'];
}

function stopPost() {
    document.getElementById('blogModalScrollableWatchPost').innerHTML = '';
}

function setProgramsCategories(categories) {
    let programsFilter = document.getElementById('portfolio-filter');
    Object.keys(categories).forEach(function (category) {
        let categoryDiv = '' +
            '<li class="button-border list-inline-item">\n' +
            '    <a class="pill-button" data-filter=".' + category + '" href="#">' + categories[category] + '</a>\n' +
            '</li>\n';
        programsFilter.innerHTML += categoryDiv;
    });
}

function setPrograms(programs) {
    let programsDiv = document.getElementById('programsDiv');
    programsDiv.innerHTML = '';
    programs.forEach(function (program) {
        let programCategories = '';
        program.categories.forEach(function (category) {
            programCategories += ' ' + category;
        });
        let program_div = '' +
            '                        <div class="col-lg-4 portfolio-item' + programCategories + '">\n' +
            '                            <div class="image-border">\n' +
            '                                <div class="portfolio-item-content">\n' +
            '                                    <img alt="/" class="img-fluid"\n' +
            '                                         src="' + program['cover'] + '">\n' +
            '                                    <div class="img-overlay text-center">\n' +
            '                                        <div class="img-overlay-content">\n' +
            '                                            <div class="portfolio-icon">\n' +
            '                                                <a href="' + program.registryLink + '"><i class="lni-link"></i>\n' +
            '                                                </a>\n' +
            // '                                                <button data-target="#portfolio-single" data-toggle="modal"\n' +
            // '                                                        type="button"><i class="lni-link"></i>\n' +
            // '                                                </button>\n' +
            '                                                <a class="js-zoom-gallery"\n' +
            '                                                   href="' + program['banner'] + '">\n' +
            '                                                    <i class="lni-search"></i>\n' +
            '                                                </a>\n' +
            '                                            </div>\n' +
            '                                            <a href="' + program.registryLink + '"><h5 class="mt-3 mb-0">ثبت نام</h5></a>\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                        </div>\n';
        programsDiv.innerHTML += program_div;
    })

}

function readyPrograms(response) {
    let programsDto = response;
    let categories = programsDto.categories;
    let programs = programsDto.programs;
    setProgramsCategories(categories);
    setPrograms(programs);
    portfolioIsotop();
    // changeColor();
}

function initPrograms() {
    if (navigator.onLine) {
        $.ajax({
            url: '/api/programs',
            method: 'GET',
            success: function (response) {
                readyPrograms(response);
                sessionStorage.setItem(programsStorageKey, JSON.stringify(response));
            },
        });
    } else {
        readyPrograms(JSON.parse(sessionStorage.getItem(programsStorageKey)));
    }
}

function setInfo(info) {
    Object.keys(info.social).forEach(function (socialMedia) {
        document.getElementById('social-' + socialMedia).setAttribute('href', info.social[socialMedia].link);
        ['Id1', 'Id'].forEach(function (elmId) {
            document.getElementById(socialMedia + elmId).innerHTML = '<span class="base-color">' + info.social[socialMedia].id + '</span>';
            document.getElementById(socialMedia + elmId).setAttribute('href', info.social[socialMedia].link);
        });
    });
    // document.getElementById('contact-phone-0').innerHTML = info.contact.phone;
    // document.getElementById('contact-phone-1').innerHTML = info.contact.phone;
    // document.getElementById('contact-email-0').innerHTML = info.contact.email;
    // document.getElementById('contact-email-1').innerHTML = info.contact.email;
    document.getElementById('contact-site-0').innerHTML = '<span class="base-color">' + info.contact.site + '</span>';
    document.getElementById('contact-site-0').setAttribute('href', info.contact.site);

    // document.getElementById("telegramChannelId").innerHTML = info.social.telegram.id;
    // document.getElementById("telegramChannelId").setAttribute('href', info.social.telegram.link);
    // document.getElementById("telegramChannelLink").setAttribute('href', info.social.telegram.link);
    // console.log("start info counter");
    // setTimeout(function () {
    //     console.log("start info");
    //     document.getElementById("app_install_count").setAttribute('data-to', '' + info.other.app_install_count);
    //     document.getElementById("app_install_count").innerHTML = info.other.app_install_count;
    // }, 10 * 1000);

}

function initInfo() {
    if (navigator.onLine) {
        $.ajax({
            url: 'api/info',
            method: 'GET',
            success: function (info) {
                setInfo(info);
                sessionStorage.setItem(infoStorageKey, JSON.stringify(info));
            }
        })
    } else {
        setInfo(JSON.parse(sessionStorage.getItem(infoStorageKey)));
    }
}

// async function registerSW() {
//     if ('serviceWorker' in navigator) {
//         try {
//             await navigator.serviceWorker.register('/static/js/service-worker.js');
//         } catch (e) {
//             console.log('serviceWorker registration failed');
//         }
//     }
// }

function openSignUpIn(msgId) {
    document.getElementById("SignUPINButton").click();
}

function signUp1() {
    let run = document.getElementById('rUn').value,
        rp1 = document.getElementById("rP1").value,
        rp2 = document.getElementById("rP2").value;
    if (run === "") {
        signUpInMsg('نام کاربری الزامی‌ست', 'e');
        return null
    }
    if (rp1 === "") {
        signUpInMsg('پسورد الزامی‌ست', 'e');
        return null
    }
    if (rp2 === "" || !(rp1 === rp2)) {
        signUpInMsg('تکرار پسورد اشتباه‌ست', 'e');
        return null
    }
    signUpUser(run, rp1);
}

function signUp() {

    "use strict";

    var email = $('#email').val();
    var password = $('#password').val();
    var repeatpass = $('#repeatpass').val();
    if (!email) {
        $('#message').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('ایمیل یادت رفته');
    } else if (!validateEmail(email)) {
        $('#message').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('ایمیل رو اشتباه نوشتی');
    } else if (!password) {
        $('#message').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('یه پسورد خوب انتخاب کن');
    } else if (password.length < 8) {
        $('#message').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('پسوردت حداقل ۸ تا کاراکتر باشه دیگه');
    } else if (!repeatpass) {
        $('#message').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('یبار دیگه پسوردت رو تکرار کنی تموم میشه');
    } else if (!(repeatpass === password)) {
        $('#message').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('پسورد رو درست تکرار نکردی');
    } else {
        $.ajax({
            type: 'POST',
            data: $("#signupForm").serialize(),
            url: "/api/signup",
            beforeSend: function () {
                $('#sign-up-btn').html('<span class="spinner-border spinner-border-sm"></span> صبر کن ...');
            },
            success: function (data) {
                $('#sign-up-btn').html('ثبت نام');
                let myObj = data;
                if (myObj['status'] === 'Done') {
                    $('#message').toast('show').addClass('bg-success').removeClass('bg-danger bg-warning');
                    $('.toast-body').html('<strong></strong> ' + myObj['msg']);
                    signUpInDone();
                } else if (myObj['status'] === 'Error') {
                    $('#message').toast('show').addClass('bg-danger').removeClass('bg-success bg-warning');
                    $('.toast-body').html('<strong></strong> ' + myObj['msg']);
                } else if (myObj['status'] === 'Warning') {
                    $('#message').toast('show').addClass('bg-warning').removeClass('bg-success bg-danger');
                    $('.toast-body').html('<strong></strong> ' + myObj['msg']);
                }
            },
            error: function (xhr) {
                $('#sign-up-btn').html('ثبت نام');
                $('#message').toast('show').addClass('bg-danger').removeClass('bg-success bg-warning');
                $('.toast-body').html('<strong> خطا : </strong> یه مشکلی پیش اومده لطفا بعدا دوباره امتحان کن');
            },
        });
    }
}

function signIn1() {
    let un = document.getElementById('Un').value,
        p1 = document.getElementById("P1").value;
    if (un === "") {
        signUpInMsg('نام کاربری الزامی‌ست', 'e', 'In');
        return null
    }
    if (p1 === "") {
        signUpInMsg('پسورد الزامی‌ست', 'e', 'In');
        return null
    }
    signInUser(un, p1);
}

function signIn() {

    "use strict";
    console.log("Sign In ...");
    let email = $('#email-in').val();
    let password = $('#password-in').val();
    // var repeatpass = $('#repeatpass').val();
    if (!email) {
        $('#message-in').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('ایمیل یادت رفته');
    } else if (!validateEmail(email)) {
        $('#message-in').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('ایمیل رو اشتباه نوشتی');
    } else if (!password) {
        $('#message-in').toast('show').addClass('bg-danger').removeClass('bg-success');
        $('.toast-body').html('پسورد یادت رفت');
    } else {
        $.ajax({
            type: 'POST',
            data: $("#signinForm").serialize(),
            url: "/api/signin",
            beforeSend: function () {
                $('#sign-in-btn').html('<span class="spinner-border spinner-border-sm"></span> صبر کن ...');
            },
            success: function (data) {
                $('#sign-in-btn').html('ورود');
                let myObj = data;
                if (myObj['status'] === 'Done') {
                    $('#message-in').toast('show').addClass('bg-success').removeClass('bg-danger bg-warning');
                    $('.toast-body').html('<strong></strong> ' + myObj['msg']);
                    signUpInDone();
                } else if (myObj['status'] === 'Error') {
                    $('#message-in').toast('show').addClass('bg-danger').removeClass('bg-success bg-warning');
                    $('.toast-body').html('<strong></strong> ' + myObj['msg']);
                } else if (myObj['status'] === 'Warning') {
                    $('#message-in').toast('show').addClass('bg-warning').removeClass('bg-success bg-danger');
                    $('.toast-body').html('<strong>خطا : </strong> ' + myObj['msg']);
                }
            },
            error: function (xhr) {
                $('#sign-in-btn').html('ورود');
                $('#message-in').toast('show').addClass('bg-danger').removeClass('bg-success bg-warning');
                $('.toast-body').html('<strong> خطا : </strong> یه مشکل پیش اومده لطفا بعدا دوباره امتحان کن');
            },
        });
    }
}

function signUpInDone() {
    sessionStorage.setItem(userUsageKey, '0');
    setTimeout(function () {
        document.getElementById("signUpInx").click();
    }, 1.5 * 1000);
}

function signUpUser(userName, passWord) {
    $.ajax({
        url: 'api/signup',
        method: 'POST',
        header: {'content-type': 'application/json'},
        data: {username: userName, password: passWord},
        success: function (response) {
            if (response.successful) {
                signUpInMsg('ثبت‌نام انجام شد', 's');
                signUpInDone();
            } else {
                signUpInMsg(response.msg, 'e');
            }
        }
    })
}

function signInUser(userName, passWord) {
    $.ajax({
        url: 'api/signin',
        method: 'POST',
        header: {'content-type': 'application/json'},
        data: {username: userName, password: passWord},
        success: function (response) {
            if (response.successful) {
                // signUpMsg('ثبت‌نام انجام شد', 's');
                signUpInDone();
            } else {
                signUpInMsg(response.msg, 'e', 'In');
            }
        }
    })
}

function signUpInMsg(msg, msgType, signType = 'Up') {
    let msgColors = {'e': 'red', 's': 'green'};
    let signUpMsg = document.getElementById("sign" + signType + "Msg");
    signUpMsg.innerHTML = msg;
    signUpMsg.style.color = msgColors[msgType];
}

function showSignInDiv() {
    document.getElementById("signInDiv").style.display = 'block';
    document.getElementById("signUpDiv").style.display = 'none';
}

function showSignInDiv1() {
    document.getElementById("signInDiv").style.display = 'block';
    document.getElementById("signUpDiv").style.display = 'none';
}

function showSignUpDiv() {
    document.getElementById("signUpDiv").style.display = 'block';
    document.getElementById("signInDiv").style.display = 'none';
}