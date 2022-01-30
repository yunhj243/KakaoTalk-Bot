let days = 0;
let isnight = false;
let start = false;
let end = false;
let job_list = [1, 2, 3, 4];
let player_list = new Array();//목록
let alive_list = new Array();
let player_job = new Object();//직업
let player_live = new Object();//생사여부, 마담 유혹등 추가 예정
/* 0 : 생존 1 : 사망 */
let player_target = new Object();//타겟
let player_check = new Object();//능력 사용 확인
/* 변수 설정 */

let job_type = {
    1: "마피아", 
    2: "경찰", 
    3: "의사", 
    4: "시민"
};
    
remove = (arr, args) => arr.filter(e => e !== args);

function police(target, player) {
    //경찰 능력
    if (player_live.player == 0) {
        if (isnight == true) {
            player_check[player] = true;
            return player_list[target - 1] + "님은 마피아가 " + (player_job[player_list[target - 1]] == 1 ? "맞습니다" : "아닙니다 ");
        } else {
            return "밤이 아닙니다.";
        }
    } else {
        return "죽은 사람은 능력을 사용하지 못합니다.";
    }
}

function mafia(target, player) {
    if (player_live.player == 0) {
        if (isnight == true) {
            player_check[player] = true;
            player_target[1] = target;
            return player_list[target - 1] + "님을 공격합니다";
        } else {
            return "밤에만 능력 사용 가능합니다.";
        }
    } else {
        return "죽은 사람은 능력을 사용하지 못합니다.";
    }
}

function doctor(target, player) {
    if (player_live.player == 0) {
        if (isnight == true) {
            player_check[player] = true;
            player_target[3] = target;
            return player_list[target - 1] + "님을 치료합니다";
        } else {
            return "밤에만 능력 사용 가능합니다.";
        }
    } else {
        return "죽은 사람은 능력을 사용하지 못합니다.";
    }
}

function day() {
    if (player_target[1] == player_target[3]) {
        return days + "일째 낮이 밝았습니다.\n의사는 치료에 성공하였습니다.";
    } else {
        player_live[player_list[player_target[1]]] = 1;
        remove(alive_list, player_live[player_list[player_target[1]]]);
        return days + "일째 낮이 밝았습니다.\n마피아의 공격으로 " + player_target[1] + "번 " + player_live[player_list[player_target[1]]] + "님은 사망하셨습니다.";
    }
}

function allocation() { //직업배정
    start = true;
    for (i = 0; i < 4; i++) {
        player_job[player_list[i]] = job_list[Math.floor(Math.random() * job_list.length)];
        job_list.splice(job_list.indexOf(player_job[player_list[i]]), 1);
    }
    return "밤이 되었습니다.";
}

function list() {
    result = [];
    for (i = 0; i < player_list.length; i++) {
        let a = Number(i) + Number(1) + "번 " + player_list[i] + (player_live[player_list[i]] == 0 ? " (생존)" : " (사망)");
        result.push(a);
    }
    return result.join('\n');
}

function check() {
    for (i = 0; i < alive_list.length; i++) {
        if (player_check[alive_list[i]] == true) {
            continue;
        } else {
            return true;
        }
        end = end_check();
        return false;
    }
}

function night() {
    days++;
    isnight = true;
    if (days == 1) {
        return allocation();
    } else {
        return "밤이 되었습니다.";
    }
}

function end_check() {
    if (alive_list.length <= 2) {
        for (i = 0; i < alive_list.length; i++) {
            let a = player_job[alive_list[i]];
            if (a != 1) {
                continue;
            } else {
                winner = win(1);
                return true;
            }
        } 
        winner = win(0);
        return true;
    } return false;
}

function win(num) {
    if(num == 1) {
        start = false;
        return "마피아의 승리입니다.";
    } else {
        start = false;
        return "시민팀의 승리입니다.";
    }
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
    if(msg == "/join") {
        if(sender.indexOf(player_list) == -1) {
            player_list.push(sender);
            replier.reply("join");
        } else {
            replier.reply("fail");
        }
    } else if(msg=="/out") {
        if(sender.indexOf(player_list) != -1) {
            player_list.splice(player_list.indexOf(sender), 1);
            replier.reply("out");
        } else {
            replier.reply("fail");
        }
    } else if(msg == "/start") {
        if(sender == player_list[0]) {
            replier.reply(night());
        }
    } else if(msg == "/job") {
        replier.reply(player_job[sender]);
    }
    if (start == true) {
        isnight = check();
    }
    if(end == true) {
        replier.reply(winner); 
        Api.reload('마피아제작');
    }
    if (msg == "/목록" && start == true) {
        replier.reply(list());
    }
}
