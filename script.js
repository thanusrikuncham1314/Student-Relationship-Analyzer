let students = [];
let relations = [];

// ===============================
// START ANALYSIS
// ===============================

function startAnalysis() {
    const section = document.getElementById("analysisSection");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    setTimeout(() => {
        const input = document.getElementById("studentName");
        if (input) input.focus();
    }, 500);
}


// ===============================
// ADD STUDENT
// ===============================

function addStudent() {
    const input = document.getElementById("studentName");

    if (!input) return;

    const name = input.value.trim();

    if (name === "") {
        showMessage("Please enter a student name.");
        return;
    }

    // Duplicate names are not allowed because A is a SET
    const alreadyExists = students.some(
        student => student.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
        showMessage("This student is already in the set.");
        input.focus();
        return;
    }

    students.push(name);

    input.value = "";

    displayStudents();
    updateContinueButton();

    input.focus();
}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents() {
    const list = document.getElementById("studentList");

    if (!list) return;

    list.innerHTML = "";

    students.forEach((student, index) => {
        const chip = document.createElement("div");

        chip.className = "student-chip";

        chip.innerHTML = `
            <span>${escapeHTML(student)}</span>
            <button onclick="removeStudent(${index})" title="Remove student">
                ×
            </button>
        `;

        list.appendChild(chip);
    });
}


// ===============================
// REMOVE STUDENT
// ===============================

function removeStudent(index) {
    const removedStudent = students[index];

    // Remove student
    students.splice(index, 1);

    // Remove relations containing that student
    relations = relations.filter(
        pair =>
            pair[0] !== removedStudent &&
            pair[1] !== removedStudent
    );

    displayStudents();
    updateContinueButton();

    // Rebuild relation section if it exists
    const builder = document.getElementById("relationBuilder");

    if (builder) {
        builder.remove();

        if (students.length >= 1) {
            createRelationBuilder();
        }
    }
}


// ===============================
// CONTINUE BUTTON
// ===============================

function updateContinueButton() {
    const button = document.getElementById("continueBtn");

    if (!button) return;

    // IMPORTANT:
    // Only ONE student is enough
    if (students.length >= 1) {
        button.disabled = false;
        button.classList.add("active");
    } else {
        button.disabled = true;
        button.classList.remove("active");
    }
}


// ===============================
// CONTINUE TO RELATION BUILDER
// ===============================

function continueToRelations() {

    if (students.length < 1) {
        showMessage("Please add at least one student.");
        return;
    }

    createRelationBuilder();
}


// ===============================
// CREATE RELATION BUILDER
// ===============================

function createRelationBuilder() {

    // Remove old builder if already present
    const oldBuilder = document.getElementById("relationBuilder");

    if (oldBuilder) {
        oldBuilder.remove();
    }

    const section = document.createElement("section");

    section.id = "relationBuilder";
    section.className = "analysis-section relation-builder";

    section.innerHTML = `
        <div class="section-number">02</div>

        <div class="section-heading">
            <span class="eyebrow">RELATION LAB</span>

            <h2>Build Relation R</h2>

            <p>
                Select two students to create an ordered pair in relation R.
            </p>
        </div>

        <div class="relation-card">

            <div class="relation-select-row">

                <div class="select-group">
                    <label>STUDENT A</label>

                    <select id="studentA">
                        ${createStudentOptions()}
                    </select>
                </div>

                <div class="relation-arrow">
                    →
                </div>

                <div class="select-group">
                    <label>STUDENT B</label>

                    <select id="studentB">
                        ${createStudentOptions()}
                    </select>
                </div>

            </div>

            <button class="add-relation-btn" onclick="addRelation()">
                + ADD RELATION
            </button>

            <div class="current-relation">

                <div class="relation-label">
                    CURRENT RELATION R
                </div>

                <div id="relationList">
                    <div class="empty-relation">
                        No ordered pairs added yet.
                    </div>
                </div>

            </div>

            <button class="analyze-btn" onclick="analyzeRelation()">
                ANALYZE RELATION R →
            </button>

        </div>
    `;

    document.body.appendChild(section);

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    displayRelations();
}


// ===============================
// CREATE STUDENT OPTIONS
// ===============================

function createStudentOptions() {

    return students
        .map(student => `
            <option value="${escapeHTML(student)}">
                ${escapeHTML(student)}
            </option>
        `)
        .join("");
}


// ===============================
// ADD RELATION
// ===============================

function addRelation() {

    const studentA = document.getElementById("studentA");
    const studentB = document.getElementById("studentB");

    if (!studentA || !studentB) return;

    const a = studentA.value;
    const b = studentB.value;

    const alreadyExists = relations.some(
        pair => pair[0] === a && pair[1] === b
    );

    if (alreadyExists) {
        showMessage(`(${a}, ${b}) is already in relation R.`);
        return;
    }

    relations.push([a, b]);

    displayRelations();
}


// ===============================
// DISPLAY RELATIONS
// ===============================

function displayRelations() {

    const list = document.getElementById("relationList");

    if (!list) return;

    if (relations.length === 0) {

        list.innerHTML = `
            <div class="empty-relation">
                No ordered pairs added yet.
            </div>
        `;

        return;
    }

    list.innerHTML = "";

    relations.forEach((pair, index) => {

        const item = document.createElement("div");

        item.className = "relation-item";

        item.innerHTML = `
            <span>
                (${escapeHTML(pair[0])}, ${escapeHTML(pair[1])})
            </span>

            <button
                onclick="removeRelation(${index})"
                title="Remove relation"
            >
                ×
            </button>
        `;

        list.appendChild(item);
    });
}


// ===============================
// REMOVE RELATION
// ===============================

function removeRelation(index) {

    relations.splice(index, 1);

    displayRelations();
}


// ===============================
// ANALYZE RELATION
// ===============================

function analyzeRelation() {

    if (students.length === 0) {
        showMessage("Please add at least one student.");
        return;
    }

    if (relations.length === 0) {
        showMessage("Please add at least one ordered pair.");
        return;
    }

    const reflexive = checkReflexive();
    const symmetric = checkSymmetric();
    const antisymmetric = checkAntisymmetric();
    const transitive = checkTransitive();

    const equivalence =
        reflexive.result &&
        symmetric.result &&
        transitive.result;

    createAnalysisResult(
        reflexive,
        symmetric,
        antisymmetric,
        transitive,
        equivalence
    );
}


// ===============================
// REFLEXIVE
// ===============================

function checkReflexive() {

    const missing = [];

    students.forEach(student => {

        const exists = relations.some(
            pair =>
                pair[0] === student &&
                pair[1] === student
        );

        if (!exists) {
            missing.push(student);
        }
    });

    if (missing.length === 0) {

        return {
            result: true,
            reason: "Every student has its self-pair.",
            proof: "For every a ∈ A, (a,a) ∈ R."
        };

    }

    return {
        result: false,
        reason: `Missing self-pair(s): ${missing
            .map(name => `(${name}, ${name})`)
            .join(", ")}`,

        proof: "A reflexive relation must contain (a,a) for every student."
    };
}


// ===============================
// SYMMETRIC
// ===============================

function checkSymmetric() {

    for (const pair of relations) {

        const a = pair[0];
        const b = pair[1];

        const reverseExists = relations.some(
            reverse =>
                reverse[0] === b &&
                reverse[1] === a
        );

        if (!reverseExists) {

            return {
                result: false,

                reason:
                    `(${a}, ${b}) exists, but (${b}, ${a}) is missing.`,

                proof:
                    "If (a,b) ∈ R, then (b,a) must also belong to R."
            };
        }
    }

    return {
        result: true,
        reason: "Every ordered pair has its reverse pair.",
        proof: "If (a,b) ∈ R, then (b,a) ∈ R."
    };
}


// ===============================
// ANTISYMMETRIC
// ===============================

function checkAntisymmetric() {

    for (const pair of relations) {

        const a = pair[0];
        const b = pair[1];

        if (a === b) {
            continue;
        }

        const reverseExists = relations.some(
            reverse =>
                reverse[0] === b &&
                reverse[1] === a
        );

        if (reverseExists) {

            return {
                result: false,

                reason:
                    `Both (${a}, ${b}) and (${b}, ${a}) exist.`,

                proof:
                    "For antisymmetry, if (a,b) and (b,a) are both in R, then a must equal b."
            };
        }
    }

    return {
        result: true,
        reason: "No distinct pair has its reverse.",
        proof:
            "For distinct a and b, both (a,b) and (b,a) do not occur together."
    };
}


// ===============================
// TRANSITIVE
// ===============================

function checkTransitive() {

    for (const first of relations) {

        for (const second of relations) {

            const a = first[0];
            const b = first[1];

            const b2 = second[0];
            const c = second[1];

            if (b === b2) {

                const requiredPairExists = relations.some(
                    pair =>
                        pair[0] === a &&
                        pair[1] === c
                );

                if (!requiredPairExists) {

                    return {
                        result: false,

                        reason:
                            `(${a}, ${b}) and (${b}, ${c}) exist, but (${a}, ${c}) is missing.`,

                        proof:
                            "If (a,b) ∈ R and (b,c) ∈ R, then (a,c) must also belong to R."
                    };
                }
            }
        }
    }

    return {
        result: true,
        reason: "Every required transitive pair exists.",
        proof:
            "Whenever (a,b) and (b,c) are in R, (a,c) is also in R."
    };
}


// ===============================
// CREATE ANALYSIS RESULT
// ===============================

function createAnalysisResult(
    reflexive,
    symmetric,
    antisymmetric,
    transitive,
    equivalence
) {

    const oldResult = document.getElementById("analysisResult");

    if (oldResult) {
        oldResult.remove();
    }

    const resultSection = document.createElement("section");

    resultSection.id = "analysisResult";
    resultSection.className = "analysis-result-section";

    resultSection.innerHTML = `

        <div class="section-number">03</div>

        <div class="section-heading">

            <span class="eyebrow">
                MATHEMATICAL ANALYSIS
            </span>

            <h2>
                Relation Properties
            </h2>

            <p>
                The relation has been analyzed mathematically.
            </p>

        </div>

        <div class="property-grid">

            ${createPropertyCard(
                "↻",
                "REFLEXIVE",
                reflexive,
                "A reflexive relation must contain (a,a) for every student."
            )}

            ${createPropertyCard(
                "↔",
                "SYMMETRIC",
                symmetric,
                "If (a,b) ∈ R, then (b,a) ∈ R."
            )}

            ${createPropertyCard(
                "≠",
                "ANTISYMMETRIC",
                antisymmetric,
                "Distinct elements cannot contain both reverse pairs."
            )}

            ${createPropertyCard(
                "→",
                "TRANSITIVE",
                transitive,
                "If (a,b) and (b,c) exist, then (a,c) must exist."
            )}

        </div>

        <div class="equivalence-card ${equivalence ? "verified" : "failed"}">

            <div class="equivalence-icon">
                ${equivalence ? "✓" : "!"}
            </div>

            <div>

                <span class="eyebrow">
                    FINAL CLASSIFICATION
                </span>

                <h3>
                    ${
                        equivalence
                            ? "EQUIVALENCE RELATION"
                            : "NOT AN EQUIVALENCE RELATION"
                    }
                </h3>

                <p>
                    ${
                        equivalence
                            ? "The relation is Reflexive, Symmetric and Transitive."
                            : "An equivalence relation requires Reflexive + Symmetric + Transitive properties."
                    }
                </p>

            </div>

        </div>

        <button class="new-analysis-btn" onclick="resetAnalysis()">
            ↻ NEW ANALYSIS
        </button>
    `;

    document.body.appendChild(resultSection);

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    addResultStyles();
}


// ===============================
// PROPERTY CARD
// ===============================

function createPropertyCard(
    icon,
    title,
    data,
    definition
) {

    return `
        <div class="property-card ${data.result ? "passed" : "failed"}">

            <div class="property-icon">
                ${icon}
            </div>

            <h3>
                ${title}
            </h3>

            <div class="property-status">
                ${
                    data.result
                        ? "✓ VERIFIED"
                        : "✕ FAILED"
                }
            </div>

            <p class="property-reason">
                ${escapeHTML(data.reason)}
            </p>

            <p class="property-proof">
                ${escapeHTML(data.proof)}
            </p>

            <p class="property-definition">
                ${escapeHTML(definition)}
            </p>

        </div>
    `;
}


// ===============================
// RESET EVERYTHING
// ===============================

function resetAnalysis() {

    students = [];
    relations = [];

    const builder = document.getElementById("relationBuilder");
    const result = document.getElementById("analysisResult");

    if (builder) builder.remove();
    if (result) result.remove();

    displayStudents();
    updateContinueButton();

    const input = document.getElementById("studentName");

    if (input) {
        input.value = "";
        input.focus();
    }

    const analysisSection = document.getElementById("analysisSection");

    if (analysisSection) {
        analysisSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ===============================
// MESSAGE
// ===============================

function showMessage(message) {

    const oldMessage = document.querySelector(".custom-message");

    if (oldMessage) {
        oldMessage.remove();
    }

    const box = document.createElement("div");

    box.className = "custom-message";

    box.innerHTML = `
        <span>${escapeHTML(message)}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(box);

    setTimeout(() => {

        if (box.parentElement) {
            box.remove();
        }

    }, 3000);
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ===============================
// ENTER KEY
// ===============================

document.addEventListener("keydown", function(event) {

    if (event.key !== "Enter") return;

    const input = document.getElementById("studentName");

    if (
        document.activeElement === input &&
        input &&
        input.value.trim() !== ""
    ) {
        addStudent();
    }

});


// ===============================
// EXTRA RESULT STYLES
// ===============================

function addResultStyles() {

    if (document.getElementById("dynamicStyles")) return;

    const style = document.createElement("style");

    style.id = "dynamicStyles";

    style.innerHTML = `

        .relation-builder,
        .analysis-result-section {
            max-width: 1400px;
            margin: 0 auto;
            padding: 100px 8%;
            position: relative;
        }

        .section-number {
            color: #55d6ff;
            font-weight: 800;
            font-size: 18px;
            letter-spacing: 2px;
            margin-bottom: 12px;
        }

        .section-heading .eyebrow {
            color: #55d6ff;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 3px;
        }

        .section-heading h2 {
            font-size: clamp(42px, 6vw, 72px);
            margin: 12px 0;
            color: #f5f7ff;
        }

        .section-heading p {
            color: #8192aa;
            font-size: 18px;
        }

        .relation-card {
            margin-top: 50px;
            padding: 48px;
            border-radius: 30px;
            background: rgba(16, 29, 47, 0.85);
            border: 1px solid rgba(120, 160, 200, 0.16);
            box-shadow: 0 30px 80px rgba(0,0,0,0.25);
        }

        .relation-select-row {
            display: grid;
            grid-template-columns: 1fr 80px 1fr;
            gap: 24px;
            align-items: end;
        }

        .select-group label {
            display: block;
            margin-bottom: 12px;
            color: #7fcfff;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 2px;
        }

        .select-group select {
            width: 100%;
            padding: 18px;
            border-radius: 16px;
            border: 1px solid rgba(120,160,200,0.18);
            background: #0b1b2c;
            color: white;
            font-size: 17px;
            outline: none;
        }

        .relation-arrow {
            text-align: center;
            color: #55d6ff;
            font-size: 36px;
        }

        .add-relation-btn {
            margin-top: 30px;
            padding: 16px 24px;
            border-radius: 14px;
            border: 1px solid rgba(85,214,255,0.35);
            background: rgba(85,214,255,0.10);
            color: #55d6ff;
            font-weight: 800;
            cursor: pointer;
        }

        .current-relation {
            margin-top: 38px;
            padding: 28px;
            border-radius: 22px;
            background: rgba(4,13,24,0.65);
        }

        .relation-label {
            color: #55d6ff;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 2px;
            margin-bottom: 18px;
        }

        .relation-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 17px 20px;
            margin-top: 10px;
            border-radius: 14px;
            background: #13283b;
            color: #eef5ff;
            font-size: 17px;
        }

        .relation-item button {
            border: 0;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            color: #9eb0c5;
            cursor: pointer;
            font-size: 20px;
        }

        .empty-relation {
            color: #72849b;
            padding: 10px 0;
        }

        .analyze-btn {
            width: 100%;
            margin-top: 30px;
            padding: 20px;
            border: 0;
            border-radius: 18px;
            background: linear-gradient(90deg,#55d6ff,#7468ff);
            color: white;
            font-weight: 900;
            letter-spacing: 1px;
            cursor: pointer;
        }

        .property-grid {
            display: grid;
            grid-template-columns: repeat(2,1fr);
            gap: 22px;
            margin-top: 45px;
        }

        .property-card {
            padding: 35px;
            border-radius: 26px;
            background: rgba(17,31,50,0.88);
            border: 1px solid rgba(100,150,190,0.18);
        }

        .property-card.passed {
            border-color: rgba(50,220,160,0.30);
        }

        .property-card.failed {
            border-color: rgba(255,90,110,0.30);
        }

        .property-icon {
            font-size: 34px;
            color: #55d6ff;
            margin-bottom: 18px;
        }

        .property-card h3 {
            color: #f5f7ff;
            font-size: 24px;
            margin: 0 0 12px;
        }

        .property-status {
            font-weight: 900;
            letter-spacing: 1px;
            margin-bottom: 22px;
        }

        .passed .property-status {
            color: #4ee6ae;
        }

        .failed .property-status {
            color: #ff6678;
        }

        .property-reason {
            color: #a8b7c9;
            font-size: 17px;
            line-height: 1.6;
        }

        .property-proof,
        .property-definition {
            color: #71859d;
            line-height: 1.6;
            font-size: 14px;
        }

        .equivalence-card {
            margin-top: 25px;
            padding: 32px;
            border-radius: 25px;
            display: flex;
            gap: 25px;
            align-items: center;
            background: rgba(15,29,47,0.9);
        }

        .equivalence-card.verified {
            border: 1px solid rgba(60,230,170,0.35);
        }

        .equivalence-card.failed {
            border: 1px solid rgba(255,100,120,0.35);
        }

        .equivalence-icon {
            width: 62px;
            height: 62px;
            border-radius: 18px;
            display: grid;
            place-items: center;
            font-size: 30px;
            background: rgba(85,214,255,0.10);
            color: #55d6ff;
        }

        .equivalence-card h3 {
            margin: 8px 0;
            color: #f5f7ff;
            font-size: 24px;
        }

        .equivalence-card p {
            color: #8294aa;
        }

        .new-analysis-btn {
            margin-top: 30px;
            padding: 16px 25px;
            border-radius: 14px;
            border: 1px solid rgba(85,214,255,0.3);
            background: rgba(85,214,255,0.08);
            color: #55d6ff;
            font-weight: 800;
            cursor: pointer;
        }

        .custom-message {
            position: fixed;
            right: 25px;
            bottom: 25px;
            z-index: 9999;
            padding: 16px 20px;
            border-radius: 14px;
            background: #13283b;
            border: 1px solid rgba(85,214,255,0.3);
            color: white;
            display: flex;
            gap: 20px;
            align-items: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }

        .custom-message button {
            border: 0;
            background: transparent;
            color: #9db0c5;
            font-size: 20px;
            cursor: pointer;
        }

        @media(max-width:800px) {

            .relation-select-row {
                grid-template-columns: 1fr;
            }

            .relation-arrow {
                transform: rotate(90deg);
            }

            .property-grid {
                grid-template-columns: 1fr;
            }

            .relation-card {
                padding: 25px;
            }

        }

    `;

    document.head.appendChild(style);
}
