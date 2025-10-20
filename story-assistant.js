/**
 * Live Story Assistant - Single File Version (v11)
 * Author: Gemini
 * Description: A self-contained script that adds a floating button to any webpage.
 * It intelligently scans the page or helps you build user flows to generate user stories and UI mockups.
 */

(function() {
    // --- START: CONFIGURATION ---
    // IMPORTANT: You must get a free API key from Google AI Studio and paste it here.
    const API_KEY = "AIzaSyCiYp8p53H7Mv1WOPbzZ2VLllw7-Zf8fak"; // <-- PASTE YOUR API KEY HERE

    // --- END: CONFIGURATION ---


    // --- START: CORE LOGIC (The "Brain") ---

    async function callTextGenerativeAI(payload) {
        if (!API_KEY) {
            throw new Error("API Key is missing. Please add your key to the story-assistant.js file.");
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        if (!responseText) { throw new Error("Received an empty response from the API."); }

        const result = JSON.parse(responseText);
        if (!response.ok) { throw new Error(result.error?.message || `API request failed with status ${response.status}`); }
        
        const candidate = result.candidates?.[0];
        if (candidate?.content?.parts?.[0]?.text) {
            try {
                const rawText = candidate.content.parts[0].text;
                const jsonText = rawText.replace(/^```json\n/, '').replace(/\n```$/, '');
                return JSON.parse(jsonText);
            } catch (e) {
                console.error("Failed to parse JSON response from AI:", candidate.content.parts[0].text);
                throw new Error("The AI returned a response in an invalid format. Please try again.");
            }
        } else {
            throw new Error("Invalid response structure from the AI model.");
        }
    }

    async function callImageGenerationAI(prompt) {
        if (!API_KEY) {
             throw new Error("API Key is missing. Please add your key to the story-assistant.js file.");
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`;
        const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1} };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error?.message || `Image generation failed with status ${response.status}`);
        }

        if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
            return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        } else {
            throw new Error("Invalid response from image generation model.");
        }
    }

    function buildGenerationPrompt(uiSchema, userContext, features) {
        return `
            You are an expert Agile Product Manager. A UI schema from a live webpage and a user's context are provided. Generate a developer-ready Jira user story as a JSON object.
            **UI Schema from Live Page Scan:**
            \`\`\`json
            ${JSON.stringify(uiSchema, null, 2)}
            \`\`\`
            **User's Context:**
            - As a: "${userContext.role}"
            - I want to: "${userContext.goal}"
            - So that: "${userContext.benefit}"
            **Key Features (Filters, Search, Sorting) mentioned by the user:**
            ${features || "None provided."}
            **Instructions:**
            1.  **Output JSON:** Your entire response MUST be a single, valid JSON object.
            2.  The JSON object must have keys: "storyTitle", "userStory", "description", "acceptanceCriteria", "referencedComponents", "suggestedSubtasks", "storyPoints", "technicalRequirements".
            3.  **Jira Markdown Headers:** For the "description", "acceptanceCriteria", etc. values, prepend a Jira-style markdown header using bold asterisks (e.g., "*Description*").
            4.  **Subtasks Formatting:** For the "suggestedSubtasks" value, list the categories (e.g., "Front-End") on their own lines without markdown or punctuation. Use a blank line to separate each category. Do not add punctuation at the end of subtask lines. Subtasks are mandatory.
            5.  **Story Points:** The "storyPoints" value must be a string with a Fibonacci number from this specific scale (1, 2, 3, 5, 8, 13, 20, 40, 100) and a brief justification.
            6.  **Technical Requirements:** The "technicalRequirements" value must list potential technical needs or dependencies.
        `;
    }

    function buildGuidedFlowPrompt(flowDescription, userContext, flowDetails) {
        return `
            You are an expert Agile Product Manager. A user has provided a step-by-step description of a user flow. Your task is to generate a user story that describes this flow.

            **User's Step-by-Step Flow Description:**
            \`\`\`
            ${flowDescription}
            \`\`\`

            **Additional Flow Details from user:**
            ${flowDetails || "None provided."}

            **User's Context:**
            - As a: "${userContext.role}"
            - I want to: "${userContext.goal}"
            - So that: "${userContext.benefit}"

            **Instructions:**
            1.  **Create a Narrative Description:** Use the user's step-by-step flow to write a detailed narrative in the "description" field. The description should be a direct, human-readable explanation of the user's journey. For example: "When a user clicks on the 'Communications Hub' menu item, they see a page with a table of receipts. When they then click on the 'Receipts' menu item, they are presented with a search function, a filter function, and a table of data containing receipts for accounts."
            2.  **Create Acceptance Criteria:** Based on the user's flow, create specific "Given/When/Then" steps for the "acceptanceCriteria" field.
            3.  **Follow Standard JSON Output:** Adhere to all formatting rules, including the JSON structure, Jira markdown headers, subtask formatting, and story points.
            
            **CRITICAL: Your entire output must be a single, valid JSON object following this exact structure:**
            {
              "storyTitle": "Story Title Here",
              "userStory": "User story sentence here.",
              "description": "*Description*\\nWhen a user clicks on [element], they see [result]. When they then click on [another element]...",
              "acceptanceCriteria": "*Acceptance Criteria (AC)*\\n- *AC 1:* Given the user is on the initial page, when they click the '...' button, then the page updates to show '...'",
              "referencedComponents": "*Referenced Components*\\n- Component 1",
              "suggestedSubtasks": "Front-End\\n- Task 1\\n\\nBack-End\\n- Task 2",
              "storyPoints": "X Points - Justification here.",
              "technicalRequirements": "*Technical Requirements*\\n- Requirement 1"
            }
        `;
    }
    
    function buildImagePrompt(storyObject) {
        return `Create a clean, modern, high-fidelity UI mockup for a web application feature. The mockup should be visually appealing and professional.
        Feature Title: ${storyObject.storyTitle}
        User Story: ${storyObject.userStory}
        Description: ${storyObject.description.replace(/\*/g, '')}
        Key UI Components to include: ${storyObject.referencedComponents.replace(/\*/g, '')}`;
    }

    function buildRefinementPrompt(originalStoryObject, instructions) {
         return `
            You are an expert Agile Product Manager. A user has provided a draft user story as a JSON object and an instruction to refine it. Your task is to rewrite and improve the story based on the user's instruction.
            **Refinement Instruction from User:**
            ${instructions}
            **Original User Story JSON to be Refined:**
            \`\`\`json
            ${JSON.stringify(originalStoryObject, null, 2)}
            \`\`\`
            Please provide the complete, refined user story as a single, valid JSON object, following the same structure and formatting rules as the original, including the bold markdown headers and subtask formatting.
        `;
    }

    // --- END: CORE LOGIC ---


    // --- START: SCANNER LOGIC (The "Eyes") ---
    
    function getMeaningfulElement(el) {
        if (!el) return null;
        const interactiveParent = el.closest('button, a[href], input, select, textarea');
        return interactiveParent || el;
    }
    
    function extractElementDetails(el) {
        const meaningfulEl = getMeaningfulElement(el);
        if (!meaningfulEl) return null;

        const textContent = meaningfulEl.textContent?.trim();
        const placeholder = meaningfulEl.placeholder;
        const ariaLabel = meaningfulEl.getAttribute('aria-label');
        return {
            type: meaningfulEl.tagName.toLowerCase(),
            id: meaningfulEl.id,
            'data-story': meaningfulEl.getAttribute('data-story'),
            placeholder: placeholder,
            text: textContent || ariaLabel || meaningfulEl.value,
            name: meaningfulEl.name,
        };
    }

    function scanPage() {
        const interactiveElements = document.querySelectorAll('button, input, a[href], select, textarea');
        const components = Array.from(interactiveElements).map(el => extractElementDetails(el)).filter(Boolean);
        return { pageTitle: document.title, components };
    }

    // --- END: SCANNER LOGIC ---


    // --- START: UI CREATION (The "Interface") ---
    
    function createUI() {
        const styles = `
            .lsa-hidden { display: none !important; }
            .lsa-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9998; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
            .lsa-modal-window { background: #1f2937; color: #e5e7eb; border-radius: 16px; width: 90%; max-width: 800px; height: 85vh; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: sans-serif; }
            .lsa-modal-header { padding: 16px 24px; border-bottom: 1px solid #4b5563; display: flex; justify-content: space-between; align-items: center; }
            .lsa-modal-body { padding: 0 24px 24px 24px; flex-grow: 1; overflow-y: auto; }
            .lsa-output-section { position: relative; }
            .lsa-output-section h4 { color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 20px 0 8px 0; }
            .lsa-textarea { width: 100%; box-sizing: border-box; padding: 12px; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb; font-size: 14px; resize: none; overflow: hidden; }
            .lsa-title-textarea { font-size: 18px; font-weight: 600; padding: 8px 0; border: none; background: transparent; color: #e5e7eb; }
            .lsa-static-content { background-color: #374151; padding: 16px; border-radius: 8px; font-size: 14px; white-space: pre-wrap; }
            .lsa-button { padding: 12px; border-radius: 8px; border: none; background-color: #2563eb; color: white; cursor: pointer; font-size: 16px; }
            .lsa-button:disabled { background-color: #4b5563; cursor: not-allowed; }
            .lsa-section-copy { position: absolute; top: 16px; right: 0; background: #4b5563; border: none; color: #e5e7eb; border-radius: 4px; cursor: pointer; padding: 4px 8px; font-size: 12px; opacity: 0.5; transition: opacity 0.2s; }
            .lsa-output-section:hover .lsa-section-copy, .lsa-collapsible:hover .lsa-section-copy { opacity: 1; }
            .lsa-collapsible summary { list-style: none; cursor: pointer; display: flex; align-items: center; position: relative; }
            .lsa-collapsible summary::-webkit-details-marker { display: none; }
            .lsa-collapsible summary::before { content: '▶'; font-size: 10px; margin-right: 8px; transition: transform 0.2s; display: inline-block; }
            .lsa-collapsible[open] > summary::before { transform: rotate(90deg); }
            .lsa-loader { text-align: center; padding: 40px; }
            .lsa-loader-text { margin-top: 16px; font-size: 16px; color: #d1d5db; }
            #lsa-mockup-container img { max-width: 100%; border-radius: 8px; margin-top: 8px; }
            #lsa-mockup-loader { font-size: 14px; color: #9ca3af; text-align: center; padding: 20px; }
            .lsa-mode-switcher { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
            .lsa-mode-button { background-color: #374151; border: 1px solid #4b5563; color: #d1d5db; padding: 8px; border-radius: 6px; cursor: pointer; }
            .lsa-mode-button.active { background-color: #2563eb; color: white; border-color: #2563eb; }
            .lsa-panel-header-btn { background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 24px; line-height: 1; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const triggerButton = document.createElement('button');
        triggerButton.className = 'lsa-ignore-trace';
        triggerButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
        Object.assign(triggerButton.style, {
            position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px',
            borderRadius: '50%', backgroundColor: '#2563eb', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', border: 'none', zIndex: 9999
        });

        const windowContainer = document.createElement('div');
        windowContainer.className = 'lsa-ignore-trace';
        Object.assign(windowContainer.style, {
            position: 'fixed', bottom: '100px', right: '20px', width: '380px', maxHeight: '70vh',
            backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 9998, display: 'none',
            flexDirection: 'column', fontFamily: 'sans-serif',
        });
        
        windowContainer.innerHTML = `
            <div style="padding: 16px; background-color: #374151; border-bottom: 1px solid #4b5563; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Live Story Assistant</h3>
                <div>
                    <button id="lsa-panel-minimize" class="lsa-panel-header-btn" style="margin-right: 8px;">&ndash;</button>
                    <button id="lsa-panel-close" class="lsa-panel-header-btn">&times;</button>
                </div>
            </div>
            <div id="lsa-panel-content" style="padding: 16px; overflow-y: auto; flex-grow: 1;">
                 <div class="lsa-mode-switcher">
                     <button id="lsa-mode-scan" class="lsa-mode-button active">Analyze Screen</button>
                     <button id="lsa-mode-flow" class="lsa-mode-button">Build a Flow</button>
                 </div>
                 <div id="lsa-input-fields">
                     <div style="margin-bottom: 12px;"><label style="font-size: 14px; margin-bottom: 4px; display: block;">As a...</label><input id="lsa-role" type="text" placeholder="e.g., an administrator" style="width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb;"></div>
                     <div style="margin-bottom: 12px;"><label style="font-size: 14px; margin-bottom: 4px; display: block;">I want to...</label><input id="lsa-goal" type="text" placeholder="e.g., view the user dashboard" style="width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb;"></div>
                     <div style="margin-bottom: 12px;"><label style="font-size: 14px; margin-bottom: 4px; display: block;">So that...</label><input id="lsa-benefit" type="text" placeholder="e.g., I can monitor user activity" style="width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb;"></div>
                     <div id="lsa-scan-fields">
                        <div style="margin-bottom: 12px;"><label style="font-size: 14px; margin-bottom: 4px; display: block;">Key Features (Optional)</label><textarea id="lsa-features" rows="3" placeholder="e.g., Filter by status, Search by name" style="width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb; resize: vertical;"></textarea></div>
                     </div>
                     <div id="lsa-flow-fields" class="lsa-hidden">
                        <div style="margin-bottom: 12px;"><label style="font-size: 14px; margin-bottom: 4px; display: block;">Describe the User Flow</label><textarea id="lsa-flow-description" rows="6" placeholder="1. User clicks the '...' button." style="width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb; resize: vertical;"></textarea></div>
                        <div style="margin-bottom: 12px;"><label style="font-size: 14px; margin-bottom: 4px; display: block;">Additional Flow Details (Optional)</label><textarea id="lsa-flow-details" rows="3" placeholder="e.g., The table should support pagination." style="width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #4b5563; background-color: #374151; color: #e5e7eb; resize: vertical;"></textarea></div>
                     </div>
                 </div>
                 <div id="lsa-panel-error" style="color: #ef4444; font-size: 14px; margin-top: 8px;"></div>
                 <button id="lsa-generate" class="lsa-button" style="width: 100%; margin-top: 8px;">Generate Story</button>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'lsa-modal-overlay lsa-hidden lsa-ignore-trace';
        modal.innerHTML = `
            <div class="lsa-modal-window">
                <div class="lsa-modal-header">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Generated User Story</h3>
                    <button id="lsa-modal-close" style="background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 24px;">&times;</button>
                </div>
                <div class="lsa-modal-body">
                    <div id="lsa-loader-container" class="lsa-loader lsa-hidden">
                         <div style="font-size: 48px;">🤖</div>
                         <p id="lsa-loader-text" class="lsa-loader-text">Brewing a fresh pot of requirements...</p>
                    </div>
                    <div id="lsa-story-output-container">
                         <!-- Content will be injected here -->
                    </div>
                     <div id="lsa-mockup-section" class="lsa-hidden">
                        <div class="lsa-output-section"><h4>Generated Mockup</h4></div>
                        <button id="lsa-generate-mockup" class="lsa-button" style="width: 100%; margin-bottom: 12px;">Generate Mockup Image</button>
                        <div id="lsa-mockup-container">
                            <div id="lsa-mockup-loader" class="lsa-hidden">Generating image... this can take a moment.</div>
                            <img id="lsa-mockup-image" class="lsa-hidden" />
                            <a id="lsa-download-mockup" class="lsa-button lsa-hidden" style="text-decoration: none; text-align: center; margin-top: 8px; background-color: #4b5563; display: block;">Download Image</a>
                        </div>
                     </div>
                     <div style="margin-top: 16px; border-top: 1px solid #4b5563; padding-top: 16px;" id="lsa-refine-section">
                        <label style="font-size: 14px; margin-bottom: 4px; display: block;">Refine Story (Optional)</label>
                        <textarea id="lsa-refine-instructions" rows="2" placeholder="e.g., Add a section for accessibility considerations." class="lsa-textarea" style="min-height: 40px;"></textarea>
                    </div>
                    <div id="lsa-modal-error" style="color: #ef4444; font-size: 14px; margin-top: 8px;"></div>
                    <div style="display: flex; gap: 8px; margin-top: 16px;" id="lsa-modal-buttons">
                        <button id="lsa-refine" class="lsa-button" style="flex-grow: 1;">Refine</button>
                        <button id="lsa-copy" class="lsa-button" style="background-color: #4b5563;">Copy for Jira</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(triggerButton);
        document.body.appendChild(windowContainer);
        document.body.appendChild(modal);
        
        const outputContainer = document.getElementById('lsa-story-output-container');
        const loaderContainer = document.getElementById('lsa-loader-container');
        const refineSection = document.getElementById('lsa-refine-section');
        const modalButtons = document.getElementById('lsa-modal-buttons');
        const mockupSection = document.getElementById('lsa-mockup-section');
        
        const modeScanBtn = document.getElementById('lsa-mode-scan');
        const modeFlowBtn = document.getElementById('lsa-mode-flow');
        const generateBtn = document.getElementById('lsa-generate');
        const scanFields = document.getElementById('lsa-scan-fields');
        const flowFields = document.getElementById('lsa-flow-fields');
        const flowDescriptionTextarea = document.getElementById('lsa-flow-description');

        const headers = ["Story Title", "User Story", "Description", "Acceptance Criteria (AC)", "Suggested Subtasks", "Story Points", "Referenced Components", "Technical Requirements"];
        const keyMap = {
            "Story Title": "storyTitle", "User Story": "userStory", "Description": "description",
            "Acceptance Criteria (AC)": "acceptanceCriteria", "Referenced Components": "referencedComponents",
            "Suggested Subtasks": "suggestedSubtasks", "Story Points": "storyPoints", "Technical Requirements": "technicalRequirements"
        };

        function autoSizeTextarea(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }

        function renderStoryFromObject(contentMap) {
             if (!contentMap) return;
             
             let html = '';
             const collapsibleHeaders = ["Referenced Components", "Technical Requirements"];
             headers.forEach(header => {
                 const contentKey = keyMap[header];
                 if (contentMap[contentKey]) {
                     const id = `lsa-output-${contentKey}`;
                     const isCollapsible = collapsibleHeaders.includes(header);
                     const showCopyButton = header !== "Suggested Subtasks";
                     const copyButtonHtml = showCopyButton ? `<button class="lsa-section-copy" data-target="${id}">Copy</button>` : '';

                     if (isCollapsible) {
                         html += `<details class="lsa-collapsible"><summary><div class="lsa-output-section" style="width: 100%;"><h4>${header}</h4>${copyButtonHtml}</div></summary>`;
                         html += `<div id="${id}" class="lsa-static-content">${contentMap[contentKey]}</div></details>`;
                     } else {
                         html += `<div class="lsa-output-section"><h4>${header}</h4>${copyButtonHtml}`;
                         if (header === "Suggested Subtasks" || header === "Story Points") {
                             html += `<div id="${id}" class="lsa-static-content">${contentMap[contentKey]}</div>`;
                         } else {
                             const extraClass = (header === "Story Title" || header === "User Story") ? ' lsa-title-textarea' : '';
                             html += `<textarea id="${id}" class="lsa-textarea${extraClass}">${contentMap[contentKey]}</textarea>`;
                         }
                         html += '</div>';
                     }
                 }
             });
             outputContainer.innerHTML = html;
             mockupSection.classList.remove('lsa-hidden');

             setTimeout(() => {
                 outputContainer.querySelectorAll('.lsa-textarea').forEach(autoSizeTextarea);
             }, 0);
        }

        function reconstructStoryObject() {
            const storyObject = {};
            headers.forEach(header => {
                const contentKey = keyMap[header];
                const id = `lsa-output-${contentKey}`;
                const element = document.getElementById(id);
                if (element) {
                    const content = (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') ? element.value : element.textContent;
                    storyObject[contentKey] = content;
                }
            });
            return storyObject;
        }

        function reconstructStoryForJira() {
            let fullText = '';
            const jiraHeaders = ["User Story", "Description", "Acceptance Criteria (AC)"];
            const storyObject = reconstructStoryObject();
            
            jiraHeaders.forEach(header => {
                const contentKey = keyMap[header];
                if(storyObject[contentKey]) {
                    fullText += `${storyObject[contentKey]}\n\n`;
                }
            });
            return fullText.trim();
        }

        // --- Event Handlers ---
        triggerButton.addEventListener('click', () => { windowContainer.style.display = windowContainer.style.display === 'flex' ? 'none' : 'flex'; });
        windowContainer.querySelector('#lsa-panel-close').addEventListener('click', () => { windowContainer.style.display = 'none'; });
        
        const panelContent = document.getElementById('lsa-panel-content');
        windowContainer.querySelector('#lsa-panel-minimize').addEventListener('click', () => {
            panelContent.classList.toggle('lsa-hidden');
            windowContainer.style.height = panelContent.classList.contains('lsa-hidden') ? 'auto' : '';
        });
        
        modal.querySelector('#lsa-modal-close').addEventListener('click', () => { modal.classList.add('lsa-hidden'); });

        outputContainer.addEventListener('input', e => {
            if (e.target.classList.contains('lsa-textarea')) {
                autoSizeTextarea(e.target);
            }
        });

        outputContainer.addEventListener('click', e => {
            if (e.target.classList.contains('lsa-section-copy')) {
                const targetId = e.target.dataset.target;
                const elementToCopy = document.getElementById(targetId);
                if (elementToCopy) {
                    const textToCopy = (elementToCopy.tagName === 'TEXTAREA' || elementToCopy.tagName === 'INPUT') ? elementToCopy.value : elementToCopy.textContent;
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        e.target.textContent = 'Copied!';
                        setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
                    });
                }
            }
        });
        
        let currentMode = 'scan';

        modeScanBtn.addEventListener('click', () => {
            currentMode = 'scan';
            modeScanBtn.classList.add('active');
            modeFlowBtn.classList.remove('active');
            scanFields.classList.remove('lsa-hidden');
            flowFields.classList.add('lsa-hidden');
        });
        
        modeFlowBtn.addEventListener('click', () => {
            currentMode = 'flow';
            modeFlowBtn.classList.add('active');
            modeScanBtn.classList.remove('active');
            scanFields.classList.add('lsa-hidden');
            flowFields.classList.remove('lsa-hidden');
            if (flowDescriptionTextarea.value === '') {
                flowDescriptionTextarea.value = '1. ';
            }
        });
        
        flowDescriptionTextarea.addEventListener('input', () => {
            if (flowDescriptionTextarea.value === '') {
                flowDescriptionTextarea.value = '1. ';
            }
        });
        
        flowDescriptionTextarea.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const currentVal = flowDescriptionTextarea.value;
                const lines = currentVal.split('\n');
                const nextNum = lines.length + 1;
                flowDescriptionTextarea.value += `\n${nextNum}. `;
            }
        });


        const refineBtn = document.getElementById('lsa-refine');
        const copyBtn = document.getElementById('lsa-copy');
        const generateMockupBtn = document.getElementById('lsa-generate-mockup');

        let loadingInterval;
        const loadingMessages = [
            "Brewing a fresh pot of requirements...",
            "Consulting the agile spirits...",
            "Translating pixels into prose...",
            "Untangling the spaghetti code (figuratively)...",
            "Generating synergy... please wait."
        ];

        function startLoadingAnimation() {
            let messageIndex = 0;
            const loaderText = document.getElementById('lsa-loader-text');
            loaderText.textContent = loadingMessages[0];
            loadingInterval = setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                loaderText.textContent = loadingMessages[messageIndex];
            }, 2500);
        }

        function stopLoadingAnimation() {
            clearInterval(loadingInterval);
        }


        async function handleGeneration() {
            const role = document.getElementById('lsa-role').value;
            const goal = document.getElementById('lsa-goal').value;
            const benefit = document.getElementById('lsa-benefit').value;
            const panelError = document.getElementById('lsa-panel-error');

            if (!role || !goal || !benefit) {
                panelError.textContent = 'Error: Please fill in all "As a, I want to, So that" fields.';
                return;
            }
            panelError.textContent = '';
            
            modal.classList.remove('lsa-hidden');
            outputContainer.classList.add('lsa-hidden');
            refineSection.classList.add('lsa-hidden');
            modalButtons.classList.add('lsa-hidden');
            mockupSection.classList.add('lsa-hidden');
            loaderContainer.classList.remove('lsa-hidden');
            startLoadingAnimation();
            
            try {
                let prompt;
                if(currentMode === 'scan') {
                    const features = document.getElementById('lsa-features').value;
                    const uiSchema = scanPage();
                    prompt = buildGenerationPrompt(uiSchema, { role, goal, benefit }, features);
                } else { // flow
                    const flowDescription = document.getElementById('lsa-flow-description').value;
                    const flowDetails = document.getElementById('lsa-flow-details').value;
                    if (!flowDescription) {
                        throw new Error("Please describe the user flow in the text box.");
                    }
                    prompt = buildGuidedFlowPrompt(flowDescription, {role, goal, benefit}, flowDetails);
                }
                const resultObject = await callTextGenerativeAI({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
                renderStoryFromObject(resultObject);
            } catch (e) {
                outputContainer.innerHTML = `<div class="lsa-output-section" style="color: #ef4444;"><h4>An error occurred:</h4><p>${e.message}</p></div>`;
            } finally {
                stopLoadingAnimation();
                loaderContainer.classList.add('lsa-hidden');
                outputContainer.classList.remove('lsa-hidden');
                refineSection.classList.remove('lsa-hidden');
                modalButtons.classList.remove('lsa-hidden');
            }
        }
        
        generateBtn.addEventListener('click', () => {
             generateBtn.disabled = true;
             handleGeneration().finally(() => { generateBtn.disabled = false; });
        });

        async function handleRefinement() {
            const instructions = document.getElementById('lsa-refine-instructions');
            const modalError = document.getElementById('lsa-modal-error');
            
            if (!instructions.value) {
                modalError.textContent = 'Please provide refinement instructions.';
                return;
            }
            modalError.textContent = '';
            refineBtn.textContent = 'Refining...';
            refineBtn.disabled = true;

            try {
                const currentStoryObject = reconstructStoryObject();
                const prompt = buildRefinementPrompt(currentStoryObject, instructions.value);
                const resultObject = await callTextGenerativeAI({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
                renderStoryFromObject(resultObject);
                instructions.value = '';
            } catch (e) {
                modalError.textContent = `Error: ${e.message}`;
            } finally {
                refineBtn.textContent = 'Refine';
                refineBtn.disabled = false;
            }
        }

        async function handleMockupGeneration() {
            const loader = document.getElementById('lsa-mockup-loader');
            const image = document.getElementById('lsa-mockup-image');
            const downloadLink = document.getElementById('lsa-download-mockup');
            
            generateMockupBtn.disabled = true;
            loader.textContent = 'Generating image... this can take a moment.';
            loader.classList.remove('lsa-hidden');
            image.classList.add('lsa-hidden');
            downloadLink.classList.add('lsa-hidden');

            try {
                const storyObject = reconstructStoryObject();
                const prompt = buildImagePrompt(storyObject);
                const imageUrl = await callImageGenerationAI(prompt);
                image.src = imageUrl;
                downloadLink.href = imageUrl;
                downloadLink.download = `${storyObject.storyTitle.replace(/ /g, '_')}_mockup.png`;
                image.classList.remove('lsa-hidden');
                downloadLink.classList.remove('lsa-hidden');
                loader.classList.add('lsa-hidden');
            } catch (e) {
                loader.textContent = `Error: ${e.message}`;
                loader.style.color = '#ef4444';
            } finally {
                generateMockupBtn.disabled = false;
            }
        }

        copyBtn.addEventListener('click', () => {
            const jiraText = reconstructStoryForJira();
            navigator.clipboard.writeText(jiraText).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy for Jira'; }, 2000);
            });
        });

        refineBtn.addEventListener('click', handleRefinement);
        generateMockupBtn.addEventListener('click', handleMockupGeneration);
    }

    // --- INITIALIZATION ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();

