let elementIdsWaiting4MathJax = [];
const userUsageKey = 'userUsage';
let unAuthorizedWaiting = 0;

function poly2CoeffsPreview() {
    let coeffs = getPoly2Coeffs();
    let previewDiv = document.getElementById("ploy-2-preview");
    let a = coeffs[0];
    let a_str = a + "x^2";
    if (a === 0) {
        a_str = "";
    }
    if (a === 1) {
        a_str = "x^2";
    }
    if (a === -1) {
        a_str = "-x^2";
    }
    let b = coeffs[1];
    let b_str = b + "x";
    if (b > 0) {
        b_str = "+ " + b + "x";
    }
    if (b === 0) {
        b_str = "";
    }
    let c = coeffs[2];
    let c_str = c;
    if (c > 0) {
        c_str = "+ " + c;
    }
    if (c === 0) {
        c_str = ""
    }
    previewDiv.innerHTML = "\\(" + a_str + " " + b_str + " " + c_str + "=0 \\)";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, previewDiv]);
}

function solvePoly2() {
    $('#calculator-loading').modal({
    		backdrop: 'static',
    		keyboard: false
		});
    let coeffs = getPoly2Coeffs();
    solvePoly(coeffs);

}

function getPoly2Coeffs() {
    let coeffs = [];
    ["a", "b", "c"].forEach(function (coeffName) {
        let coeff = parseInt(document.getElementById("poly-2-" + coeffName).value || 0);
        coeffs.push(coeff);
    });
    return coeffs
}

function solvePoly(coeffs) {
    if (!navigator.onLine) {
        alert("باید به اینترنت وصل باشی");
        return null
    }
    if (!calculatorActive()) {
        console.log("not active");
        openSignUpIn(1);
        return null
    }
    let calH5 = document.getElementById('calculator-loading-h5');
    calH5.innerHTML = 'چه معادله خوبی';
    $.ajax({
        method: "GET",
        url: '/api/solve',
        headers: {
            "Content-Type": "application/json"
        },
        data: {a: coeffs[0], b: coeffs[1], c: coeffs[2]},
        success: function (response) {
            let solutions = response.solutions;
            elementIdsWaiting4MathJax = [];
            let solution_div = document.getElementById("solution");
            solution_div.innerHTML = "";
            Object.keys(solutions).forEach(function (solution_name) {
                solution_div.innerHTML += solve(solution_name, solutions[solution_name]);
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            unAuthorizedWaiting = response.unAuthorizedWaiting;
            limitUser(response.unlimited);
            MathJaxRenderFinishCallback();
        }
    });
}

calculatorActive = () => getUserUsage() < 4;

function limitUser(unlimited) {
    let calH5 = document.getElementById('calculator-loading-h5');
    if (unlimited) {
        sessionStorage.setItem(userUsageKey, '0');
        // calH5.innerHTML = 'اگر اشتراک بخری بهت زودتر جواب میدم، دیگه تبیلغ هم نمی‌بینی';
    } else {
        calH5.innerHTML = 'اگر ثبت کنی و وارد سایت شی هر چقدر بخوای برات معادله حل می‌کنم';
        let userUsage = getUserUsage() + 1;
        sessionStorage.setItem(userUsageKey, '' + userUsage);
    }
}

function MathJaxRenderFinishCallback() {
    setTimeout(function () {
        closeCalculatorLoading();
    }, unAuthorizedWaiting * 1000);
}

function solve(solution_name, solution) {
    return '' +
        '                        <div class="col-lg-6">\n' +
        '                            <h3 class="text-dark">\n' +
        '                                <i class="lni-graduation base-color"></i>' + solution.name + '\n' +
        '                            </h3>\n' +
        '                            <div class="timeline-items box-border">' + addSteps(solution) + '</div>\n' +
        '                        </div>\n';
}

function getUserUsage() {
    let userUsage = sessionStorage.getItem(userUsageKey);
    if (userUsage === "NaN" || userUsage === null) {
        userUsage = 0;
    } else {
        userUsage = parseInt(userUsage);
    }
    return userUsage
}

function addSteps(solution) {
    let steps = '';
    solution.steps.forEach(function (step) {
        steps += '' +
            '                                <div class="timeline-item">\n' +
            '                                    <div class="timeline-icon"></div>\n' +
            '                                    <div class="timeline-contents">\n' +
            addStepPre(step) + addStepFormula(step) + addStepParr(step) + addStepPost(step) +
            '                                    </div>\n' +
            '                                </div>\n';
        steps += addAds();

    });
    return steps
}

function addAds() {
    return ''
    // return '' +
    //     '<div class="row"><div class="col-lg-12"></div>' +
    //     '<img style="width:100%;height:100%" src="https://affiliate.digikala.com/PromotionBanners/98bcf416-2a9a-417d-a29d-65eab6004ed6/8460eab1-d673-4fc2-8d59-58b9b6ebdef2-300x250.gif">'+
    //     '</div> '
}

function addStepPre(step) {
    if ("pre" in step) {
        return '' +
            '<div class="time-line-header">\n' +
            '     <h5 class="timeline-title">' + step.pre + '</h5>\n' +
            '</div>\n';
    }
    return ''
}

function addStepFormula(step) {
    let formulaDiv = '';
    if ('formula' in step) {
        step.formula.forEach(function (formula) {
            let elmId = getWaitingID();
            formulaDiv += '' +
                '<div class="row mathTextMathJax" >\n' +
                // '    <div class="col-lg-4"></div>\n'+
                // '    <div class="col-lg-4"></div>' +
                '    <div class="col-lg-12 formulaMathJax" id="' + elmId + '">' + formula + '</div>' +
                '</div>\n';
        })
    }
    return formulaDiv
}

function addStepPost(step) {
    let postDiv = '';
    if ('post' in step) {
        postDiv += '' +
            '<div class="row" >\n' +
            '    <div class="col-lg-12">' + step.post + '</div>\n' +
            // '    <div class="col-lg-4"></div>' +
            // '    <div class="col-lg-4"></div>' +
            '</div>\n';
    }
    return postDiv
}

function addStepParr(step) {
    let parrDiv = '';
    if ('parr' in step) {
        step.parr.forEach(function (parr) {
            let parr0Id = getWaitingID();
            let parr1Id = getWaitingID();
            parrDiv += '' +
                '<div class="row mathTextMathJax" >\n' +
                // '    <div class="col-lg-4"></div>\n'+
                '    <div class="col-lg-6 formulaMathJax" id="' + parr0Id + '">' + parr[0] + '</div>' +
                '    <div class="col-lg-6 formulaMathJax" id="' + parr1Id + '">' + parr[1] + '</div>' +
                '</div>\n';
        })
    }
    return parrDiv
}

function getWaitingID() {
    let elmId = 'formulaID-' + elementIdsWaiting4MathJax.length;
    elementIdsWaiting4MathJax.push(elmId);
    return elmId
}