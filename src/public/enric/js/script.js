
const { createApp, ref, onMounted, computed, watch } = Vue;

const json1 = {
    "activityName": "ENRICHMENT CUSTOM ACTIVITY",
    "fields": [
        {
            "name": "campaignID",
            "label": "Campaign ID",
            "type": "text"
        },
        {
            "name": "campaignName",
            "label": "Campaign Name",
            "type": "text"
        },
        {
            "name": "campaignType",
            "label": "Campaign Type",
            "type": "select",
            "options": [
                "Event-based",
                "Batch"
            ]
        },
        {
            "name": "offerType",
            "label": "Offer Type",
            "type": "select",
            "options": [
                "Retention",
                "X-Sell",
                "Activation",
                "Acquisition",
                "Upgrade",
                "Top-Up",
                "Customer",
                "Care",
                "Other"
            ]
        },
        {
            "name": "communicationType",
            "label": "Communication Type",
            "type": "select",
            "options": [
                "Outbound",
                "Inbound"
            ]
        },
        {
            "name": "productType",
            "label": "Product Type",
            "type": "select",
            "options": [
                "Account Loans",
                "Account Cards",
                "Credit Cards",
                "Debit Cards",
                "Payments",
                "Deposits",
                "Accounts",
                "Customer",
                "Loans",
                "FDs",
                "RDs",
                "Share Acounts",
                "Other Loans",
                "Other Cards",
                "Other"
            ]
        },
        {
            "name": "segment",
            "label": "Segment",
            "type": "select",
            "options": [
                "PI",
                "SME",
                "All"
            ]
        },
        {
            "name": "controlGroup",
            "label": "Control Group",
            "type": "select",
            "options": [
                "Yes",
                "No"
            ]
        },
        {
            "name": "abtest",
            "label": "A/B Test",
            "type": "select",
            "options": [
                "Yes",
                "No"
            ]
        },
        {
            "name": "startDate",
            "label": "Start Date",
            "type": "date"
        },
        {
            "name": "endDate",
            "label": "End Date",
            "type": "date"
        },
    ],
}

const json2 = {
    "activityName": "ENRICHMENT CUSTOM ACTIVITY",
    "fields": [
        {
            "name": "campaignType",
            "label": "Campaign Type",
            "type": "select",
            "options": [
                "Event-based",
                "Batch"
            ]
        },
        {
            "name": "offerType",
            "label": "Offer Type",
            "type": "select",
            "options": [
                "Retention",
                "X-Sell",
                "Activation",
                "Acquisition",
                "Upgrade",
                "Top-Up",
                "Customer",
                "Care",
                "Other"
            ]
        },
        {
            "name": "communicationType",
            "label": "Communication Type",
            "type": "select",
            "options": [
                "Outbound",
                "Inbound"
            ]
        },
        {
            "name": "productType",
            "label": "Product Type",
            "type": "select",
            "options": [
                "Account Loans",
                "Account Cards",
                "Credit Cards",
                "Debit Cards",
                "Payments",
                "Deposits",
                "Accounts",
                "Customer",
                "Loans",
                "FDs",
                "RDs",
                "Share Acounts",
                "Other Loans",
                "Other Cards",
                "Other"
            ]
        },
        {
            "name": "segment",
            "label": "Segment",
            "type": "select",
            "options": [
                "PI",
                "SME",
                "All"
            ]
        },
        {
            "name": "controlGroup",
            "label": "Control Group",
            "type": "select",
            "options": [
                "Yes",
                "No"
            ]
        },
        {
            "name": "abtest",
            "label": "A/B Test",
            "type": "select",
            "options": [
                "Yes",
                "No"
            ]
        },
        {
            "name": "startDate",
            "label": "Start Date",
            "type": "date"
        },
        {
            "name": "endDate",
            "label": "End Date",
            "type": "date"
        },
    ],
}

const pm = new Postmonger.Session();
const { on, trigger } = pm;
const activity = ref(null);
const interaction = ref(null);
const formData = ref({});
const tokens = ref({
    token: '',
    fuel2token: '',
});


const button = ref({
    button: 'next',
    text: 'done',
    visible: true,
    enabled: true,
});

const prevStep = () => {
    trigger('prevStep');
  };

const updateButton = () => {
    return new Promise(() => {
        trigger('updateButton', button.value);
    });
};

const requestTokens = () => {
    return new Promise((resolve) => {
        trigger('requestTokens');
        on('requestedTokens', (tokensData) => {
            tokens.value.token = tokensData.token;
            tokens.value.fuel2token = tokensData.fuel2token;
            resolve(tokensData);
        });
    });
};
const initActivity = () => {
    return new Promise((resolve) => {
        on('initActivity', (activityData) => {
            activity.value = activityData;
            resolve(activityData);
        });
    });
};

const update = () => {
    trigger('updateActivity', activity.value);
};

const updateActivity = () => {

    activity.value.metaData.isConfigured = true;
    activity.value.arguments.execute.inArguments = formData;
    trigger('updateActivity', activity.value);
    trigger('destroy')
};



const onClickedNext = () => {
    on('clickedNext', (n) => {
        console.log('gotonext', n)
        updateActivity();
    })
};

const onClickedBack = () => {

    on('clickedBack',(name) => {
        console.log('clicked back', name)
        step.value = 'step1'
    });
};

const onGoToStep = () => {
    on('gotoStep', (n) => {
        console.log('gotostep', n)
        updateActivity()
    });
};

const requestEventDefinitionID = () => {
    return new Promise((resolve) => {
        trigger('requestTriggerEventDefinition');
        on('requestedTriggerEventDefinition', (eventDefinition) => {
            if (eventDefinition && eventDefinition.dataExtensionId) {
                deid.value = eventDefinition.dataExtensionId;
            }
            resolve(eventDefinition);
        });
    });
};

const nextStep = () => {
    trigger('nextStep');
  };

const requestInteraction = () => {
    return new Promise((resolve) => {
      trigger('requestInteraction');
      on('requestedInteraction', (interactionData) => {
        interaction.value = interactionData;
        resolve(interactionData);
      });
    });
  };

const eventDefinitionKey = computed(() => {
    return interaction.value && interaction.value.triggers[0] && interaction.value.triggers[0].metaData
        ? interaction.value.triggers[0].metaData.eventDefinitionKey
        : null;
});

createApp({
    setup() {
        const config1 = ref({ fields: [] });
        const config2 = ref({ fields: [] });
        const nlbLogo = ref('');
        const step = ref(1);

        config1.value = json1;
        config2.value = json2;
        loadNLBLogo();

        onClickedBack()
        onClickedNext()
        onGoToStep()

        onMounted(async () => {
            console.log('start trigger ready');
            trigger('ready');

            try {
                const tokenPromise = new Promise((resolve) => {
                    requestTokens().then(() => {
                        resolve();
                    });
                });

                await Promise.all([
                    tokenPromise,
                    requestEventDefinitionID(),
                    initActivity(),
                    requestInteraction()
                ]);
            } catch (err) {
                console.error('Received error while loading postmonger', err);
            }
            
            
            initializeLogging(); // Placeholder for logging initialization
        });

        function loadNLBLogo() {
            const logoPath = 'img/Enrichment_CA_logo.png'; // Replace with your actual logo path
            nlbLogo.value = logoPath;
        }

        function initializeLogging() {
            console.log("Logging Initialized (Placeholder - SFMC SDK needed)");
            // In a real SFMC Custom Activity, you would use SFMC SDK to:
            // 1. Initialize logging context (e.g., get journey ID, activity ID)
            // 2. Potentially load existing logs if needed
            logJourney("Activity UI Loaded"); // Example journey log entry
        }

        function logJourney(message) {
            console.log("Journey Log:", message);
            // In a real SFMC Custom Activity, you would use SFMC SDK to write to Journey Logging
            // Example SFMC SDK call (conceptual):
            // SFMCSDK.journeyLogger.log(message);
        }

        function logActivity(message) {
            console.log("Activity Log:", message);
            // In a real SFMC Custom Activity, you would use SFMC SDK to write to Activity Logging
            // Example SFMC SDK call (conceptual):
            // SFMCSDK.activityLogger.log(message);
        }


        return {
            config1,
            config2,
            formData,
            nlbLogo,
            initializeLogging, // Exposing for potential external calls if needed (usually not required for `onMounted`)
            logJourney,
            logActivity,
            nextStep,
            step,
        };
    }
}).mount('#app');