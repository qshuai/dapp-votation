App = {
  web3Provider: null,
    ins: {},
    account: '0x0',
    hasVoted: false,

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }

        App.web3Provider.enable();
        return App.initContract();
    },

    initContract: function () {
        $.getJSON("Votation.json", function(votation) {
            // Instantiate a new truffle contract from the artifact
            App.ins.Votation = TruffleContract(votation);
            // Connect provider to interact with contract
            App.ins.Votation.setProvider(App.web3Provider);

            // App.listenForEvents();

            return App.render();
        });
    },

    render: function () {
        var votationInstance;
        var loader = $("#loader");
        var content = $("#content");
        var addForm = $("#addForm");

        loader.show();
        content.hide();
        addForm.hide();

        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $("#account").text("Your Account: " + account);
            }
        });

        App.ins.Votation.deployed().then(function (instance) {
            votationInstance = instance;

            // the the msg.sender is the contract creator,
            // open add form.
            votationInstance.owner().then(function (owner) {
                if (App.account === owner) {
                    addForm.show()
                }
            });

            return votationInstance.candidateCount();
        }).then(function (count) {
            var result = $("#result");
            result.empty();

            var list = $("#votingList");

            for (var i = 1; i <= count; i++) {
                votationInstance.candidates(i).then(function (candidate) {
                    var id = candidate[0];
                    var name = candidate[1];
                    var votes = candidate[2];

                    var candidateTemplate = '<tr><th scope="row">'+ id +'</th><td>'+name+'</td><td>'+votes+'</td></tr>';
                    result.append(candidateTemplate);

                    var optionTemplate = '<option value='+ id + '>'+ '['+id+'] ' +name + '</option>';
                    list.append(optionTemplate);
                })
            }

            return votationInstance.hasVoted(App.account);
        }).then(function (hashVoted) {
            if (hashVoted) {
                $("#voteForm").hide();
            }

            loader.hide();
            content.show();
        }).catch(function (error) {
            console.warn(error);
        })
    }
};

$(document).ready(function () {
    App.init();

    $("#add").click(function () {
        var name = $("#voteName").val();
        if (name === "") {
            console.log("the name for candidate should not be empty!");
            return
        }

        App.ins.Votation.deployed().then(function (instance) {
            return instance.addCandidate(name, { from: App.account });
        }).then(function (result) {
            // $("#loader").hide();
            // $("#content").show();
        }).catch(function (err) {
            console.error(err);
        })
    })
});