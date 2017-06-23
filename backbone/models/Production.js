define([
    'jquery', 'backbone', 'backbone.memento', 'moment',
    'Models/ProductionStatus', 'Models/InternalTicket', 'Models/GeneralMessage', 'Models/Audio', 'Models/User',
    'Collections/AutoAttendants', 'Collections/GeneralMessages', 'Collections/OnHoldMessages', 'Collections/Greetings', 'Collections/GreetingNotes', 'Collections/Tickets', 'Collections/OnHoldScripts',
    'Collections/ProductionNotes', 'Collections/ProductionHistory', 'Collections/Pickups', 
    'cfg'
], function (
	$, Backbone, Memento, Moment, 
	ProductionStatus, InternalTicket, GeneralMessage, Audio, User,
	AutoAttendants, GeneralMessages, OnHoldMessages, Greetings, GreetingNotes, Tickets, OnHoldScripts,
	ProductionNotes, ProductionHistory, Pickups, 
    cfg
) {
	var model = Backbone.Model.extend({
        defaults: {
            name: undefined,
            originalId: undefined,
            version: undefined,
            activeVersion: undefined,
            customerId: undefined,
            resellerId: undefined,
            reseller: "",
            voiceTalentId: undefined,
            audioEditorId: undefined,
            audioNote: undefined,
            engagement: undefined,
            ticketStage: undefined,
            source: undefined,


            name: undefined,
            rush: undefined,
            
            status: undefined,
            proofreading: undefined,
            wordCount: undefined,
            value: undefined,
            pickUpStatus: false,
            
            deliveryType: undefined, //"Rush" , "Standard", "ComcastDayOne"
            insertCarrier: undefined,
            insertType: undefined,

            submitDate: undefined,
            dueDate: undefined,
            deliveryDate: new Date(),
            
            pickUpStatus: false,
            
            company: undefined,

            rawAudio: undefined,
            contactEmail: undefined,


            autoAttendants: new AutoAttendants,
            general: new GeneralMessages,
            onHold: new OnHoldMessages,

            internalNotes: new ProductionNotes,
            customerNotes: new ProductionNotes,
            history: new ProductionHistory,
            internalTicket: new InternalTicket,
            audio: new Audio,
            customer: new User
        },
        model:{
            //relational models
            autoAttendants: AutoAttendants,
            general: GeneralMessages,
            onHold: OnHoldMessages,

            internalNotes: ProductionNotes,
            customerNotes: ProductionNotes,
            history: ProductionHistory,
            internalTicket: InternalTicket,
            audio: Audio,
            customer: User
        },

        initialize: function (options) {
            var memento = new Backbone.Memento(this);
                _.extend(this, memento);
        },

        updateWordCount: function () {
            var prodWordCount = 0;
            this.autoAttendants.each(_.bind(function (autoAttendant) {
                autoAttendant.greetings.each(_.bind(function (greeting) {
                    prodWordCount += greeting.get('wordCount');
                }, this));
            }, this));

            this.set('wordCount', prodWordCount);
        },

        url: function () {
            return cfg.baseApiUrl + 'Snap/Production/' + (!!this.id ? this.id : '');
        },

        parse: function (response) {
            //PARSE METHOD WILL TRANSFORM VALUES TO BE USABLE FOR THE APP
            //IS EXECUTED ON EVERY MODEL AFTER WE FETCH IT FROM THE API
            var moment = require('moment');

            //SUB MODELS LINKING
            for(var key in this.model)
            {
                var embeddedClass = this.model[key];
                var embeddedData = response[key];
                response[key] = new embeddedClass(embeddedData);
            }            

            response.due = false;
            //ORDERS DUE DATE (WHEN WE HAVE TO DELIVER THE ORDER TO THE CUSTOMER)
            var dueMoment = moment(response.dueDate);
            var dueToday = dueMoment.format("MM-DD-YYYY");
            response.dueDateMoment = dueMoment;
            
            var nowMoment = moment();
            var now = nowMoment.format("MM-DD-YYYY");
            var tomorrow = nowMoment.add(1, 'days').format("MM-DD-YYYY");
            var twoDays = nowMoment.add(1, 'days').format("MM-DD-YYYY");

            //ORDER DUE CALCULATION BASED ON DUE DATE AND ACTUAL DATE
            //DUE IS USED ACROSS THE APP
            if (moment(now,'MM-DD-YYYY').isSameOrAfter(dueToday)) {
                response.due = 'today';
            } else if (moment(tomorrow,'MM-DD-YYYY').isSame(dueToday)) {
                response.due = 'tomorrow';
            } else if (moment(twoDays,'MM-DD-YYYY').isSame(dueToday)) {
                response.due = '2Days';
            }

            //SORT GENERAL MESSAGES
            response.general.comparator = function (model) {
                return model.get('index')
            }
            response.general.sort();

            //SORT ON HOLD MESSAGES
            response.onHold.comparator = function (model) {
                return model.get('index')
            }
            
            if(!!response.createdDate) {
                response.createdDate = new moment(response.createdDate);    
            }

            response.submitDate = new moment(response.submitDate);
            response.deliveryDate = new moment(response.deliveryDate);
            
            //IF WE HAVE AN ASSIGNMENT ORDER IS SEND TO RECORD
            //ASSIGNMENT DUE DATE IS VOICE TALENT DUE DATE
            //OR THE MAX DATE VOICETALENT SHOULD UPLOAD HIS WORK
            response.overdueVT = false;
            if (!!response.assignment) {
                if (!!response.assignment.dueDate) {
                    var assDueDateMoment = moment(response.assignment.dueDate);
                    // var assDueDate = assDueDateMoment;
                    response.vtDueDate = assDueDateMoment;

                    if (moment(now).isSameOrAfter(assDueDateMoment) && response.status == ProductionStatus.InRecording) {
                        response.overdueVT = true;
                    }
                }
            }
            
            return response;
        },
        
        sync: function(method, model, options) {
            //UPDATING ORDERS
            if (method === "update") {
                //REMOVE CURLY BRACERS
                model.get('autoAttendants').each ( _.bind( function (aa) {
                    aa.get('greetings').each ( _.bind( function (greeting) {
                        greeting.set({'script':greeting.get('script').replace(/[{}]/g,"")})
                    }, this))
                }, this));
                //REMOVE CURLY BRACERS
                model.get('onHold').each ( _.bind( function (onhold) {
                    onhold.get('elements').each ( _.bind( function (el) {
                        if (typeof(el.get('script')) != 'undefined') {
                            el.set({script: el.get('script').replace(/[{}]/g,"")});
                        }
                    }, this));
                }, this));
                //REMOVE CURLY BRACERS
                model.get('general').each ( _.bind( function (general_msg) {
                    general_msg.set({'script': general_msg.get('script').replace(/[{}]/g,"") });
                }, this));
                // return;
            }
            return Backbone.sync(method, model, options);
        },
        
        statusParse: function (status) {
            return statusParse[status];
        },
        
        isFrozen: function () {
            return this.get('onHoldStatus');
        },
        
        //FREEZE ORDER
        freeze: function () {
            this.set('onHoldStatus', true);
        },
        
        //UNFREEZE ORDER
        unfreeze: function () {
            this.set('onHoldStatus', false);
        },
        
        //CHECK IF ORDER HAS AUDIO NOTES (NOT MESSAGES)
        hasAudioNote: function () {
            return typeof(this.get('audioNote')) != 'undefined' && this.get('audioNote') != '' ? true : false;
        },
        
        //CHECK IF ORDER IS LOCKED (BY SOMEONE ELSE)
        isLocked: function (sessionId) {
            return (this.get('orderLocked') && this.get('orderOwnerId') != sessionId);
        },

        //GET HOW MANY DAYS ORDER WAS ON THE FLOW
        getDaysInProduction:function(){
            var moment = require('moment');
            var dueDate = this.get('dueDateMoment');
            var submitDate = this.get('submitDate');
            nowMoment = moment();

            var productionDays = nowMoment.diff(submitDate, 'days');
            var totalProductionDays = dueDate.diff(submitDate, 'days');

            return (productionDays + ' of ' + totalProductionDays);
        },

        //CHECK ORDER DUE DATES
        dueToday: function() {
            return (this.get('due') == 'today');
        },
        dueTomorrow: function() {
            return (this.get('due') == 'tomorrow');
        },
        due2Days: function() {
            return (this.get('due') == '2Days');
        },
        isRemaiming: function() {
            return (this.get('due') == false);
        },

        //CHECK FOR ORDER STATUSES
        isDraft: function() {
            return (this.get('status') == ProductionStatus.Draft);
        },
        isInReview: function() {
            return (this.get('status') == ProductionStatus.InReview);
        },
        isRevisionRequest: function() {
            return ( (this.get('status') === ProductionStatus.TicketSubmitted || this.get('status') === ProductionStatus.ContactedRevRequest ) && this.get('ticketType') == 'RevisionRequested' && this.get('ticketStage') == "Received");
        },
        isEditorIssue: function() {
            return (this.get('status') === ProductionStatus.TicketSubmitted && this.get('ticketType') == 'EditorIssue' && this.get('ticketStage') == "Received");
        },
        isRevisionInProgress: function() {
            return (this.get('status') === ProductionStatus.TicketSubmitted && this.get('ticketStage') == "RevisionInProgress");
        },
        isRawAudioReview: function() {
            return (this.get('status') == ProductionStatus.RawAudioIn);
        },
        isReadyForQC: function() {
            return (this.get('status') == ProductionStatus.ReadyForQC);
        },
        isDispatch: function() {
            return (this.get('status') == ProductionStatus.ToBeDispatched);
        },
        isCustomerReview: function() {
            return (this.get('status') == ProductionStatus.InCustomerReview);
        },
        isReimbursed: function () {
            return this.get('status') == ProductionStatus.Reimbursed;
        },
        isArchive: function() {
            return (this.get('status') == ProductionStatus.InCustomerReview || this.get('status') == ProductionStatus.Delivered || this.get('status') == ProductionStatus.Reimbursed)
        },
        isInEditing: function() {
            return (this.get('status') == ProductionStatus.InEditing)
        },
        isInRecording: function() {
            return (this.get('status') == ProductionStatus.InRecording);
        },
        isDispatched: function () {
            return (!_.isUndefined(this.get('assignmentId')))
        },
        isDelivered: function () {
            return (this.get('status') == ProductionStatus.Delivered)
        },
        isAbandoned: function () {
            return (this.get('status') == ProductionStatus.Abandoned)
        },
        canPickup: function() {
            if (this.isRevisionRequest() || this.isEditorIssue() || this.isRevisionInProgress()) {
                return true;
            } else {
                return false;
            }
        },
        hasRawAudio: function () {
            return _.isUndefined(this.get('rawAudio')) ? false : true;
        },
        isResellerComcast: function(){
            return this.get('reseller').indexOf('Comcast') !== -1 ? true : false;
        },
        isFullEngagement: function() {
            return this.get('engagement') === 'Full';
        },
        canEditDueDate: function(){
            return (
                    this.get('status') == ProductionStatus.ToBeDispatched ||
                    this.get('status') == ProductionStatus.InEditing ||
                    this.get('status') == ProductionStatus.RawAudioIn ||
                    this.get('status') == ProductionStatus.InRecording ||
                    this.get('status') == ProductionStatus.ReadyForQC ||
                    this.get('status') == ProductionStatus.InCustomerReview
                   );
        }
    });

	var statusParse = {};
	statusParse[ProductionStatus.Draft] = 'Draft';
	statusParse[ProductionStatus.InReview] = 'In Review';
	statusParse[ProductionStatus.ToBeDispatched] = 'To Be Dispatched';
	statusParse[ProductionStatus.InRecording] = 'In Recording';
	statusParse[ProductionStatus.RawAudioIn] = 'Raw Audio In';
	statusParse[ProductionStatus.InEditing] = 'In Editing';
	statusParse[ProductionStatus.ReadyForQC] = 'Ready to be QC\'d';
	statusParse[ProductionStatus.InCustomerReview] = 'In Customer Review';
	statusParse[ProductionStatus.ApprovedForInsertion] = 'Approved for Insertion';
	statusParse[ProductionStatus.TicketSubmitted] = 'Ticket Submitted';
    statusParse[ProductionStatus.Delivered] = 'Delivered';
    statusParse[ProductionStatus.Reimbursed] = 'Reimbursed';
    statusParse[ProductionStatus.RevisionRequested] = 'Revision Requested';
    statusParse[ProductionStatus.EditorIssue] = 'Editor Issue';
    statusParse[ProductionStatus.Refunded] = 'Refunded';
    statusParse[ProductionStatus.Abandoned] = 'Abandoned';
    statusParse[ProductionStatus.ContactedRevRequest] = 'Contacted Revision Request';

	return model;
});