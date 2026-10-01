let students = [];


/* =========================================
   START ANALYSIS
   ========================================= */

function startAnalysis() {

    const section = document.getElementById("analysisSection");

    section.scrollIntoView({
        behavior: "smooth"
    });

    setTimeout(() => {

        const input = document.getElementById("studentName");

        if (input) {
            input.focus();
        }

    }, 700);
}


/* =========================================
   ADD STUDENT
   ========================================= */

function addStudent() {

    const input = document.getElementById("studentName");

    const name = input.value.trim();

    /* Empty name check */

    if (name === "") {

        input.focus();

        showMessage("Please enter a student name.");

        return;
    }


    /* Duplicate name check */

    const alreadyExists = students.some(
        student => student.toLowerCase() === name.toLowerCase()
    );


    if (alreadyExists) {

        showMessage("This student is already added.");

        input.value = "";

        input.focus();

        return;
    }


    /* Add student */

    students.push(name);

    input.value = "";

    input.focus();

    displayStudents();

    updateContinueButton();
}


/* =========================================
   DISPLAY STUDENTS
   ========================================= */

function displayStudents() {

    const list = document.getElementById("studentList");

    list.innerHTML = "";


    students.forEach((student, index) => {

        const chip = document.createElement("div");

        chip.className = "student-chip";


        const name = document.createElement("span");

        name.textContent = student;


        const removeButton = document.createElement("button");

        removeButton.className = "remove-student";

        removeButton.innerHTML = "×";

        removeButton.title = "Remove student";


        removeButton.onclick = function () {

            removeStudent(index);

        };


        chip.appendChild(name);

        chip.appendChild(removeButton);

        list.appendChild(chip);

    });
}


/* =========================================
   REMOVE STUDENT
   ========================================= */

function removeStudent(index) {

    students.splice(index, 1);

    displayStudents();

    updateContinueButton();
}


/* =========================================
   CONTINUE BUTTON
   ========================================= */

function updateContinueButton() {

    const button = document.getElementById("continueBtn");

    /*
       Minimum 2 students required
       because a relation needs ordered pairs.
    */

    if (students.length >= 2) {

        button.disabled = false;

    } else {

        button.disabled = true;

    }
}


/* =========================================
   CONTINUE TO RELATION BUILDER
   ========================================= */

function continueToRelations() {

    if (students.length < 2) {

        showMessage(
            "Please add at least 2 students."
        );

        return;
    }


    /*
       For now we create the next section
       dynamically.
    */

    createRelationBuilder();

}


/* =========================================
   CREATE RELATION BUILDER
   ========================================= */

function createRelationBuilder() {

    let oldSection =
        document.getElementById("relationSection");


    /* Prevent duplicate sections */

    if (oldSection) {

        oldSection.scrollIntoView({
            behavior: "smooth"
        });

        return;
    }


    const section = document.createElement("section");

    section.id = "relationSection";

    section.className = "analysis-section";


    section.innerHTML = `

        <div class="section-heading">

            <div class="step-number">
                02
            </div>

            <div>

                <span class="section-label">
                    RELATION LAB
                </span>

                <h2>
                    Build Relation R
                </h2>

                <p>
                    Select two students to create an
                    ordered pair in relation R.
                </p>

            </div>

        </div>


        <div class="student-input-card">

            <div class="relation-form">

                <div class="relation-field">

                    <label>
                        STUDENT A
                    </label>

                    <select id="studentA">

                        ${createStudentOptions()}

                    </select>

                </div>


                <div class="relation-arrow">
                    →
                </div>


                <div class="relation-field">

                    <label>
                        STUDENT B
                    </label>

                    <select id="studentB">

                        ${createStudentOptions()}

                    </select>

                </div>

            </div>


            <button
                class="add-btn relation-add-btn"
                onclick="addRelation()"
            >
                + ADD RELATION
            </button>


            <div class="relation-preview">

                <div class="relation-title">
                    CURRENT RELATION R
                </div>

                <div id="relationPairs">

                    <div class="empty-relation">
                        No ordered pairs added yet.
                    </div>

                </div>

            </div>


            <button
                class="continue-btn"
                onclick="analyzeRelation()"
            >
                ANALYZE RELATION R →
            </button>

        </div>

    `;


    document.body.appendChild(section);


    section.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   CREATE STUDENT OPTIONS
   ========================================= */

function createStudentOptions() {

    return students.map(student => {

        return `
            <option value="${escapeHTML(student)}">
                ${escapeHTML(student)}
            </option>
        `;

    }).join("");

}


/* =========================================
   RELATION DATA
   ========================================= */

let relations = [];


/* =========================================
   ADD RELATION
   ========================================= */

function addRelation() {

    const studentA =
        document.getElementById("studentA").value;

    const studentB =
        document.getElementById("studentB").value;


    const pairExists = relations.some(
        pair =>
            pair[0] === studentA &&
            pair[1] === studentB
    );


    if (pairExists) {

        showMessage(
            "This ordered pair already exists."
        );

        return;
    }


    relations.push([
        studentA,
        studentB
    ]);


    displayRelations();
}


/* =========================================
   DISPLAY RELATIONS
   ========================================= */

function displayRelations() {

    const container =
        document.getElementById("relationPairs");


    if (relations.length === 0) {

        container.innerHTML = `
            <div class="empty-relation">
                No ordered pairs added yet.
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    relations.forEach((pair, index) => {

        const item =
            document.createElement("div");

        item.className = "relation-pair";


        item.innerHTML = `

            <span>
                (${escapeHTML(pair[0])},
                ${escapeHTML(pair[1])})
            </span>

            <button
                class="remove-student"
                onclick="removeRelation(${index})"
            >
                ×
            </button>

        `;


        container.appendChild(item);

    });
}


/* =========================================
   REMOVE RELATION
   ========================================= */

function removeRelation(index) {

    relations.splice(index, 1);

    displayRelations();
}


/* =========================================
   ANALYZE RELATION
   ========================================= */

function analyzeRelation() {

    if (relations.length === 0) {

        showMessage(
            "Please add at least one relation."
        );

        return;
    }


    createAnalysisResult();

}


/* =========================================
   ANALYSIS RESULT
   ========================================= */

function createAnalysisResult() {

    let oldResult =
        document.getElementById("resultSection");


    if (oldResult) {

        oldResult.remove();

    }


    const reflexive =
        checkReflexive();

    const symmetric =
        checkSymmetric();

    const antisymmetric =
        checkAntisymmetric();

    const transitive =
        checkTransitive();


    const resultSection =
        document.createElement("section");


    resultSection.id =
        "resultSection";


    resultSection.className =
        "analysis-section";


    resultSection.innerHTML = `

        <div class="section-heading">

            <div class="step-number">
                03
            </div>

            <div>

                <span class="section-label">
                    MATHEMATICAL ANALYSIS
                </span>

                <h2>
                    Relation Properties
                </h2>

                <p>
                    The relation has been analyzed
                    mathematically.
                </p>

            </div>

        </div>


        <div class="result-grid">

            ${createPropertyCard(
                "↻",
                "REFLEXIVE",
                reflexive.result,
                reflexive.reason
            )}


            ${createPropertyCard(
                "↔",
                "SYMMETRIC",
                symmetric.result,
                symmetric.reason
            )}


            ${createPropertyCard(
                "≠",
                "ANTISYMMETRIC",
                antisymmetric.result,
                antisymmetric.reason
            )}


            ${createPropertyCard(
                "→",
                "TRANSITIVE",
                transitive.result,
                transitive.reason
            )}

        </div>


        <div class="final-classification">

            <div>

                <span class="section-label">
                    FINAL CLASSIFICATION
                </span>

                <h2>
                    Equivalence Relation
                </h2>

                <p>
                    A relation is an equivalence relation
                    when it is Reflexive, Symmetric and
                    Transitive.
                </p>

            </div>


            <div class="
                ${reflexive.result &&
                  symmetric.result &&
                  transitive.result
                  ? "classification-yes"
                  : "classification-no"}
            ">

                ${
                    reflexive.result &&
                    symmetric.result &&
                    transitive.result
                    ? "✓ YES"
                    : "✕ NO"
                }

            </div>

        </div>

    `;


    document.body.appendChild(
        resultSection
    );


    addResultStyles();


    resultSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   REFLEXIVE CHECK
   ========================================= */

function checkReflexive() {

    let missing = [];


    students.forEach(student => {

        const exists =
            relations.some(
                pair =>
                    pair[0] === student &&
                    pair[1] === student
            );


        if (!exists) {

            missing.push(
                `(${student}, ${student})`
            );

        }

    });


    if (missing.length === 0) {

        return {
            result: true,
            reason: "Every student has a self-relation."
        };

    }


    return {

        result: false,

        reason:
            "Missing self-pairs: " +
            missing.join(", ")

    };

}


/* =========================================
   SYMMETRIC CHECK
   ========================================= */

function checkSymmetric() {

    for (const pair of relations) {

        const reverseExists =
            relations.some(
                other =>
                    other[0] === pair[1] &&
                    other[1] === pair[0]
            );


        if (!reverseExists) {

            return {

                result: false,

                reason:
                    `(${pair[0]}, ${pair[1]}) exists but ` +
                    `(${pair[1]}, ${pair[0]}) does not exist.`

            };

        }

    }


    return {

        result: true,

        reason:
            "Every ordered pair has its reverse pair."

    };

}


/* =========================================
   ANTISYMMETRIC CHECK
   ========================================= */

function checkAntisymmetric() {

    for (const pair of relations) {

        if (pair[0] === pair[1]) {
            continue;
        }


        const reverseExists =
            relations.some(
                other =>
                    other[0] === pair[1] &&
                    other[1] === pair[0]
            );


        if (reverseExists) {

            return {

                result: false,

                reason:
                    `Both (${pair[0]}, ${pair[1]}) and ` +
                    `(${pair[1]}, ${pair[0]}) exist.`

            };

        }

    }


    return {

        result: true,

        reason:
            "No distinct pair has its reverse."

    };

}


/* =========================================
   TRANSITIVE CHECK
   ========================================= */

function checkTransitive() {

    for (const first of relations) {

        for (const second of relations) {

            if (first[1] === second[0]) {

                const requiredPair = [
                    first[0],
                    second[1]
                ];


                const exists =
                    relations.some(
                        pair =>
                            pair[0] === requiredPair[0] &&
                            pair[1] === requiredPair[1]
                    );


                if (!exists) {

                    return {

                        result: false,

                        reason:
                            `(${first[0]}, ${first[1]}) and ` +
                            `(${second[0]}, ${second[1]}) exist, ` +
                            `but (${requiredPair[0]}, ` +
                            `${requiredPair[1]}) is missing.`

                    };

                }

            }

        }

    }


    return {

        result: true,

        reason:
            "Every required transitive pair exists."

    };

}


/* =========================================
   PROPERTY CARD
   ========================================= */

function createPropertyCard(
    icon,
    title,
    result,
    reason
) {

    return `

        <div class="
            property-result-card
            ${result ? "property-pass" : "property-fail"}
        ">

            <div class="result-icon">
                ${icon}
            </div>

            <div class="result-title">
                ${title}
            </div>

            <div class="result-status">
                ${result ? "✓ VERIFIED" : "✕ FAILED"}
            </div>

            <p>
                ${reason}
            </p>

        </div>

    `;

}


/* =========================================
   EXTRA RESULT STYLES
   ========================================= */

function addResultStyles() {

    if (
        document.getElementById(
            "dynamicResultStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "dynamicResultStyles";


    style.textContent = `

        .relation-form {
            display: flex;
            align-items: flex-end;
            gap: 20px;
        }

        .relation-field {
            flex: 1;
        }

        .relation-field label {
            display: block;
            margin-bottom: 10px;
            color: #8195aa;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
        }

        .relation-field select {
            width: 100%;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.08);
            background: #0b1a2b;
            color: white;
            outline: none;
            cursor: pointer;
        }

        .relation-arrow {
            font-size: 28px;
            color: #73d7ff;
            padding-bottom: 9px;
        }

        .relation-add-btn {
            margin-top: 25px;
            padding: 14px 20px;
        }

        .relation-preview {
            margin-top: 35px;
            padding: 22px;
            border-radius: 16px;
            background: rgba(0,0,0,0.15);
            border: 1px solid rgba(255,255,255,0.06);
        }

        .relation-title {
            color: #63ccff;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
        }

        .relation-pair {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 15px;
            margin-bottom: 8px;
            border-radius: 10px;
            background: rgba(92,204,255,0.06);
            border: 1px solid rgba(92,204,255,0.10);
            color: #c7e5f2;
            font-family: "Space Grotesk", sans-serif;
            font-size: 13px;
        }

        .empty-relation {
            color: #607389;
            font-size: 12px;
        }

        .result-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .property-result-card {
            padding: 25px;
            border-radius: 18px;
            background: rgba(255,255,255,0.035);
            border: 1px solid rgba(255,255,255,0.07);
            transition: 0.3s ease;
        }

        .property-result-card:hover {
            transform: translateY(-4px);
        }

        .property-pass {
            border-color: rgba(80,220,160,0.25);
        }

        .property-fail {
            border-color: rgba(255,100,120,0.20);
        }

        .result-icon {
            font-size: 26px;
            color: #73d7ff;
        }

        .result-title {
            margin-top: 12px;
            font-family: "Space Grotesk", sans-serif;
            font-size: 17px;
            font-weight: 700;
        }

        .result-status {
            margin-top: 6px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .property-pass .result-status {
            color: #5ee6a9;
        }

        .property-fail .result-status {
            color: #ff7185;
        }

        .property-result-card p {
            margin-top: 15px;
            color: #778ba0;
            font-size: 12px;
            line-height: 1.7;
        }

        .final-classification {
            margin-top: 20px;
            padding: 30px;
            border-radius: 20px;
            background: rgba(255,255,255,0.035);
            border: 1px solid rgba(255,255,255,0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }

        .final-classification h2 {
            margin-top: 8px;
            font-family: "Space Grotesk", sans-serif;
            font-size: 24px;
        }

        .final-classification p {
            margin-top: 8px;
            color: #71849a;
            font-size: 12px;
            max-width: 600px;
            line-height: 1.6;
        }

        .classification-yes,
        .classification-no {
            min-width: 90px;
            text-align: center;
            padding: 13px 18px;
            border-radius: 12px;
            font-family: "Space Grotesk", sans-serif;
            font-weight: 700;
            font-size: 12px;
        }

        .classification-yes {
            color: #5ee6a9;
            background: rgba(80,220,160,0.08);
            border: 1px solid rgba(80,220,160,0.18);
        }

        .classification-no {
            color: #ff7185;
            background: rgba(255,100,120,0.07);
            border: 1px solid rgba(255,100,120,0.15);
        }

        @media (max-width: 650px) {

            .relation-form {
                flex-direction: column;
                align-items: stretch;
            }

            .relation-arrow {
                text-align: center;
                transform: rotate(90deg);
            }

            .result-grid {
                grid-template-columns: 1fr;
            }

            .final-classification {
                flex-direction: column;
                align-items: flex-start;
            }

        }

    `;


    document.head.appendChild(style);
}


/* =========================================
   MESSAGE
   ========================================= */

function showMessage(message) {

    const oldMessage =
        document.querySelector(".custom-message");

    if (oldMessage) {
        oldMessage.remove();
    }


    const box =
        document.createElement("div");


    box.className =
        "custom-message";


    box.textContent =
        message;


    box.style.cssText = `

        position: fixed;
        top: 100px;
        right: 25px;
        z-index: 9999;

        padding: 14px 18px;

        border-radius: 12px;

        background: #102238;

        border: 1px solid rgba(100,200,255,0.25);

        color: #bfe9ff;

        font-size: 12px;

        box-shadow: 0 15px 40px rgba(0,0,0,0.35);

        animation: messageIn 0.25s ease;

    `;


    document.body.appendChild(box);


    setTimeout(() => {

        box.style.opacity = "0";

        box.style.transform =
            "translateX(20px)";

        box.style.transition =
            "0.3s ease";

        setTimeout(() => {
            box.remove();
        }, 300);

    }, 2200);
}


/* =========================================
   ENTER KEY SUPPORT
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const input =
            document.getElementById("studentName");


        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        addStudent();

                    }

                }
            );

        }

    }
);


/* =========================================
   HTML SAFETY
   ========================================= */

function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}