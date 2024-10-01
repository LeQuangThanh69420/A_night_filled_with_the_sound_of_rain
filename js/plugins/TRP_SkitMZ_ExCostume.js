//=============================================================================
// TRP_SkitMZ_ExCostume.js
//=============================================================================
// Copyright (c) 2021 Thirop
//=============================================================================
/*:
 * @target MZ
 * @plugindesc TRP_SkitMZ衣装差分拡張
 * @author Thirop
 * @help 【注意】拡張おまけパッチについてはTRP_SkitMZの使用条件対象外です。
 * また、TRP_SkitMZの今後のアップデートなどへの対応も保証しておりません。
 * 商用利用：○
 * 改変：○
 * 再配布：不可
 *
 * このプラグインはできるだけ下の方に配置してください。
 * TRP_SkitMZ本体はversion1.06以上を対象
 *
 * ポーズ画像に対応した衣装差分を設定できます。
 * 異なるタイプの複数の衣装を重ねて表示できます。
 * 重ねて表示する衣装画像の規格は表情差分画像と同様です。
 * 
 * 【衣装画像の名前】
 * 衣装画像は各キャラの画像フォルダ内に、costume_衣装タイプ名_ID_ポーズ名.png
 * という名前で配置してください。
 * 衣装タイプが「body」、衣装名が「armor」の衣装の
 *
 * 例)ポーズ名「pose1」に対応する画像名は
 * costume_body_armor_pose1.png
 *
 *
 * 【衣装タイプ】
 * プラグイン設定で衣装タイプ(部位)を設定してください。
 * １つの衣装タイプの衣装は最大１つまで各キャラに着せられます。
 * 画像名に含めますのでタイプ名はアルファベットで設定してください。
 *
 *
 * 【アクター設定】
 * プラグイン設定でアクターごとの設定を行います。
 * TRP_SkitMZ_Configで登録した各キャラのフォルダ名で登録してください。
 * アクターIDを登録することで、アクターの装備やステートに対応した衣装の
 * 表示が行えます。
 * 
 *
 * 【プラグインコマンド】
 * プラグインコマンドで衣装のON/OFFが行えます。
 * 同じ衣装タイプの衣装が複数表示設定されてる時の優先度は
 * プラグインコマンドでの着用 > ステート設定 > 装備設定 > 初期衣装
 * となっています。
 * また、衣装ONコマンドで衣装名を「NONE」とすることで、
 * 装備やステート、初期衣装の設定を無視して指定した衣装タイプの画像
 * を表示させないことも可能です。
 * (NONEによる強制脱衣の解除もOFFコマンドで行ってください。)
 *
 *
 * 【装備・ステート】
 * コンフィグのアクター設定でツクール上のアクターIDを設定することで
 * 装備・ステートのノート欄に設定された衣装が反映されます。
 * ノート欄には<costume:タイプ名_衣装名>の形式で衣装名を指定できます。
 * 装備によりアクターの初期衣装を脱がす場合は、
 * 衣装名に「NONE」を指定して衣装タイプを指定してください。
 *
 *
 * 【MV形式のコマンド】
 * □on/衣装のオン
 * "skit on 登録アクター名 タイプ名 衣装名 フェード"
 * 
 * ※フェード:true/tでクロスフェード,false/fで瞬時に画像切り替え
 * 　 　　　 省略時の値はプラグイン設定で変更可能
 *
 * □OFF/衣装のオフ
 * "skit off アクター名 タイプ名 フェード"
 * ※タイプ名をallとすると全てのタイプ
 * 
 *
 *
 * 【更新履歴】
 * 1.00 2021/1/14 初版
 *
 * @param types
 * @text 衣装のタイプ
 * @desc 衣装のタイプの設定。
 * @type struct<CostumeType>[]
 * @default []
 *
 * @param actorSetting
 * @text アクター設定
 * @desc アクター設定
 * @type struct<ActorSetting>[]
 * @default []
 *
 * @param defaultFade
 * @text 衣装変更時のフェードフラグ
 * @desc 衣装変更時のフェードフラグのデフォルト値
 * @type boolean
 * @default false
 *
 * @param fadeDuration
 * @text フェード所要時間
 * @desc フェード所要時間(1以上の整数)
 * @type number
 * @default 10
 *
 * @param skipError
 * @text エラー無効
 * @desc アクター名や衣装タイプが存在しない場合のエラーをスキップします。
 * @default false
 * @type boolean
 *
 *
 *
 * @command on
 * @text on/衣装のオン
 * @desc コマンドによる衣装オン。装備やステートより優先されます。
 *
 * @arg actorName
 * @text 登録アクター名
 * @desc プラグイン設定で登録したアクター名(アルファベット)
 * 
 * @arg type
 * @text タイプ名
 * @desc 衣装のタイプ名（プラグイン設定で登録したもの）。allとすると全てのタイプ
 *
 * @arg name
 * @text 衣装名
 * @desc 衣装名(対応する画像名はcostume_タイプ名_衣装名_ポーズ名.png)。NONEとすると装備・ステートの衣装設定も無効。
 *
 * @arg fade
 * @text フェード表示
 * @desc ON/trueにするとフェードで画像を切り替え
 * @type boolean
 * @default def
 *
 *
 * @command off
 * @text off/衣装のオフ
 * @desc コマンドによる衣装オフ。オフ後はデフォルト・装備・ステートで設定が反映。NONEもこのコマンドで解除
 *
 * @arg actorName
 * @text 登録アクター名
 * @desc プラグイン設定で登録したアクター名(アルファベット)
 *
 * @arg type
 * @text タイプ名
 * @desc 衣装のタイプ名（プラグイン設定で登録したもの）。allとすると全てのタイプ
 *
 * @arg fade
 * @text フェード表示
 * @desc ON/trueにするとフェードで画像を切り替え
 * @type boolean
 * @default def
 *
 */
//============================================================================= 

/*~struct~CostumeType:
 * @param name
 * @text タイプ名
 * @desc タイプ名(アルファベット)。他のタイプ名と被らないように注意。
 *
 * @param priority
 * @text 重ね順の優先度
 * @desc 重ね順の優先度(1以上の整数)。大きいほど手前(表情パーツ種類番号と対応)。
 * @type number
 * @min -10000
 * @decimals 2
 * @default 10
 *
 * @param spritesheet
 * @text スプライトシート設定(上級)
 * @desc タイプ別のスプライトシート利用の設定
 * @type select
 * @default 0
 * @option 使用しない
 * @value 0
 * @option 全てまとめてシート化(アクター名_costume_タイプ名.png)
 * @value 1
 * @option ポーズごとにまとめてシート化(アクター名_costume_タイプ名_ポーズ名.png)
 * @value 2
 *
 */

/*~struct~ActorSetting:
 * @param fileName
 * @text キャラのフォルダ名
 * @desc キャラのフォルダ名
 *
 * @param actorId
 * @text ツクール上のアクターID
 * @desc 対応するアクターIDをセットすると、装備に設定されたコスチュームを反映されます。
 * @type actor
 * @default 0
 *
 * @param defaultCostumes
 * @text デフォルトの衣装
 * @desc デフォルトの衣装
 * @type string[]
 * @default []
 *
 * @param invalidPose
 * @text 衣装無効のポーズ名
 * @desc ここで設定しなかったポーズはポーズごとのコスチューム画像が読み込まれます。
 * @type string[]
 * @default []
 *
 */



(function(){
var pluginName = 'TRP_SkitMZ_ExCostume';
var parameters = PluginManager.parameters(pluginName);

var _TRP_CORE_setupTRPSkitConfigParametersIfNeeded = TRP_CORE.setupTRPSkitConfigParametersIfNeeded;
TRP_CORE.setupTRPSkitConfigParametersIfNeeded = function(){
	var initialized = this.isSkitParametersInitialized;
	_TRP_CORE_setupTRPSkitConfigParametersIfNeeded.call(this);		
	if(initialized)return;

	var skitParameters = TRP_CORE.skitParameters;
	parameters = JSON.parse(JSON.stringify(parameters, function(key, value) {
		try {
			return JSON.parse(value);
		} catch (e) {
			try {
				return eval(value);
			} catch (e) {
				return value;
			}
		}
	}));

	var actorSettingMap = {};
	parameters.actorSetting.forEach(function(setting){
		actorSettingMap[setting.fileName] = setting;
	});
	parameters.actorSettingMap = actorSettingMap;

	parameters.typeMap = {};
	parameters.types.forEach(function(type){
		parameters.typeMap[type.name] = type;

		if(type.spritesheet>0){
			var length = parameters.actorSetting.length;
		    for(var i = 0; i<length; i=(i+1)|0){
		        var actorSetting = parameters.actorSetting[i];
		        var name = actorSetting.fileName;
		        var file = name+'_costume_'+type.name;
				if(type.spritesheet===1){
					//all packing
					TRP_SpriteSheet.load(file);
				}else{
					//pose packing
					var poses = Object.keys(skitParameters.dataActors[name].pose);
					var poseLen = poses.length;
				    for(var j=0; j<poseLen; j=(j+1)|0){
				        var pose = poses[j];
				        if(actorSetting.invalidPose && actorSetting.invalidPose.contains(pose)){
				        	continue;
				        }
						TRP_SpriteSheet.load(file+'_'+pose);
					};
				}
		    }
		}
	});
};


if(!TRP_CORE.pushUnieqly){
	TRP_CORE.pushUnieqly = function(array,arg){
		if(!array.contains(arg)){
			array.push(arg);
		}
	}
}

if(!TRP_CORE.removeArrayObjectsInArray){
	TRP_CORE.removeArrayObjectsInArray = function(array,argArray){
		var length = argArray.length;
		for(var i = 0; i<length; i=i+1){
			this.removeArrayObject(array,argArray[i]);
		}
	};	
}



//=============================================================================
// PluginManager
//=============================================================================
(()=>{
	const commands = ['on','off'];
	for(const command of commands){
		PluginManager.registerCommand(pluginName, command, function(args){
			var argsArr = Object.values(args);
			argsArr.unshift(command);
			argsArr.unshift('costume');
			$gameSkit.processCommand(argsArr);
		});
    }
})();



//=============================================================================
// Skit
//=============================================================================
var ALL_TYPE_ARGS = ['all','ALL','全て','全部'];

var _Skit_initialize = Skit.prototype.initialize;
Skit.prototype.initialize = function() {
	_Skit_initialize.call(this);
	this._costumes = {};
};

var _Skit_processCommand = Skit.prototype._processCommand || Skit.prototype.processCommand;
Skit.prototype._processCommand = function(args,macroPos){
	var skitCommand = args[0];
	switch(skitCommand){
	case 'costume':
	case Skit.COMMAND_COSTUME_J1:
	case Skit.COMMAND_COSTUME_J2:
		this.processCostumeCommand(args);
		break;
	default:
		_Skit_processCommand.call(this,args,macroPos);
	}
};

Skit.prototype.processCostumeCommand = function(args){
	var subCommand = args[1];
	switch(subCommand.toLowerCase()){
	case 'on':
	case 'オン':
		this.setCostumeOn(args);
		break;
	case 'off':
	case 'オフ':
		this.setCostumeOff(args);
		break;
	}
};


Skit.prototype.setCostumeOff = function(args){
	var idx = 2;
	var actorName = args[idx++];
	actorName = this.costumeActorName(actorName);
	if(!actorName){
		return;
	}

	var typeName = args[idx++];
	this.removeCostumeWithType(actorName,typeName);

	var fade = args[idx++];
	this.applyCostumeIfShowing(actorName,fade);
};

Skit.prototype.setCostumeOn = function(args){
	var idx = 2;
	var actorName = args[idx++];
	actorName = this.costumeActorName(actorName);
	if(!actorName){
		return;
	}

	var typeName = args[idx++];
	var costumeName = args[idx++];

	this.removeCostumeWithType(actorName,typeName);

	if(costumeName==='' || costumeName===undefined){
		return;
	}

	var actorCostume = this._costumes[actorName];
	if(!actorCostume){
		this._costumes[actorName] = actorCostume = [];
	}

	if(ALL_TYPE_ARGS.contains(typeName)){
		var types = this.allCostumeTypeSettings();
		var length = types.length;
	    for(var i = 0; i<length; i=(i+1)|0){
	        var type = types[i];
	        if(type){
	        	var name = type.name+'_'+costumeName;
				TRP_CORE.pushUnieqly(actorCostume,name);
	        }
	    }
	}else{
		var type = this.costumeTypeSetting(typeName);
		if(!type)return;

		var name = type.name+'_'+costumeName;
		TRP_CORE.pushUnieqly(actorCostume,name);
	}


	var fade = args[idx++];
	this.applyCostumeIfShowing(actorName,fade);
};

Skit.prototype.removeCostumeWithType = function(actorName,typeName){
	var actorCostume = this._costumes[actorName];
	if(!actorCostume){
		return;
	}

	if(ALL_TYPE_ARGS.contains(typeName)){
		actorCostume.length = 0;
	}else{
		var targetType = this.costumeTypeSetting(typeName);
		if(!targetType){
			return;
		}

		var length = actorCostume.length;
		var regExp = new RegExp('^'+targetType.name+'_');
	    for(var i=length-1; i>=0; i=(i-1)|0){
	        var name = actorCostume[i];
	        if(regExp.test(name)){
	        	actorCostume.splice(i,1);
	        }
	    }
	}
};

Skit.prototype.applyCostumeIfShowing = function(actorName,fade){
	if(!this.names().contains(actorName))return;

	var fade = TRP_CORE.supplementDefBool(parameters.defaultFade,fade);
	var duration = fade?Number(parameters.fadeDuration):0	
	var actor = this.actor(actorName);

	actor.setupCostume();
	if(actor.isShowing()){
		actor.applyOverlay(duration);
	}
};


/* accessor
===================================*/
Skit.prototype.costumeActorName = function(argName){
	var actorName = this.actorFolderName(argName);
	if(!actorName){
		if(!parameters.skipError){
			throw new Error('アクター名「'+argName+'」の立ち絵設定が存在しません。')
		}
		return '';
	}
	return actorName;
};

Skit.prototype.costumeTypeSetting = function(name){
	var type = parameters.typeMap[name];
	if(!type){
		if(!parameters.skipError){
			throw new Error('衣装タイプ「'+name+'」の設定データが存在しません。');
		}
		return null;
	}
	return type;
};
Skit.prototype.allCostumeTypeSettings = function(){
	return parameters.types;
};







//=============================================================================
// SkitActor
//=============================================================================
SkitActor.prototype.costumeSetting = function(){
	return parameters.actorSettingMap[this._name];
};
SkitActor.prototype.setupCostume = function(){
	var setting = this.costumeSetting();
	var costumes;

	//defaultCostume
	if(setting){
		this._costumes = costumes = setting.defaultCostumes.concat();

		//actor equips & states
		if(setting.actorId){
			var actor = $gameActors.actor(setting.actorId);

			for(var i=0; i<2; i=(i+1)|0){
				var objects = i===0 ? actor.equips() : actor.states();
				var length = objects.length;
				for(var j = 0; j<length; j=(j+1)|0){
				    var obj = objects[j];
				    if(!obj)continue;
				    var costume = obj.meta.costume;

				    if(!costume)continue;
				    this._setupCostume(costumes,costume);
				}
		    }
		}
	}

	var actorData = $gameSkit._costumes[this._name];
	if(!actorData)return;
	if(!costumes) costumes = [];

	var length = actorData.length;
	for(var i = 0; i<length; i=(i+1)|0){
	    var costume = actorData[i].toString();
	    this._setupCostume(costumes,costume);
	}

	this._costumes = costumes;
};

SkitActor.prototype._setupCostume = function(costumes,costume){
    var typeName = costume.split('_')[0];
    if(!typeName)return;

    var typeData = $gameSkit.costumeTypeSetting(typeName);
    if(!typeData)return;


    // remove same type init-costume
	var length = costumes.length;
	var regExp = new RegExp('^'+typeName+'_');
    for(var i=length-1; i>=0; i=(i-1)|0){
        var name = costumes[i];
        if(regExp.test(name)){
        	costumes.splice(i,1);
        }
    }

    //pushType
	costumes.push(costume);
};

var _SkitActor_overlayName = SkitActor.prototype.overlayName;
SkitActor.prototype.overlayName = function(){
	var overlay = _SkitActor_overlayName.call(this);
	if(this._costumes){
		overlay += this.costumeImages();
	}
	return overlay;
};

SkitActor.prototype.costumeImages = function(){
	//check pose valid
	var setting = this.costumeSetting();
	if(setting){
		if(setting.invalidPose.contains(this._pose)){
			return '';
		}
	}
	if(!this._costumes)return '';

	var text = '';
	var costumes = this._costumes;
	var length = costumes.length;
    for(var i = 0; i<length; i=(i+1)|0){
        var costume = costumes[i];
        if(costume.contains('NONE')){
        	continue;
        }
        text += '-COS:'+costume;
    }
	return text;
};

var _Sprite_Picture_convertSkitOverlayPartsId = Sprite_Picture.convertSkitOverlayPartsId;
Sprite_Picture.convertSkitOverlayPartsId = function(ret,elem,poseData,exps){
	if(elem.indexOf('COS:')===0){
		ret.push(elem);
	}else{
		_Sprite_Picture_convertSkitOverlayPartsId.call(this,ret,elem,poseData,exps);
	}
};



//=============================================================================
// Sprite_SkitOverlay
//=============================================================================
var Sprite_SkitOverlay = Sprite_Picture.Sprite_SkitOverlay;

var _Sprite_SkitOverlay_setupForExOverlay = Sprite_SkitOverlay.prototype.setupForExOverlay;
Sprite_SkitOverlay.prototype.setupForExOverlay = function(partsId,partsKind){
	if(Sprite_SkitOverlay.isTypeCostume(partsId)){
		partsId = partsId.substring(4);

		this._exPartsKind = 'costume';
		this._exPartsSubType = Sprite_SkitOverlay.costumeType(partsId);
		return partsId;
	}else{
		return _Sprite_SkitOverlay_setupForExOverlay.call(this,partsId,partsKind);
	}
};

var _Sprite_SkitOverlay_equalsMultiLayer = Sprite_SkitOverlay.prototype.equalsMultiLayer;
Sprite_SkitOverlay.prototype.equalsMultiLayer = function(actorName,poseName,partsKind,partsId){
	if(typeof partsId==='string' && partsId.contains('COS:')){
		if(this._exPartsKind!=='costume')return false;
		partsId = partsId.replace('COS:','');
		return this.actorName===actorName
			&& this.poseName===poseName
			&& this.partsId===partsId;
	}else{
		return _Sprite_SkitOverlay_equalsMultiLayer.call(this,actorName,poseName,partsKind,partsId);
	}
};

var _Sprite_SkitOverlay_zOrder = Sprite_SkitOverlay.prototype.zOrder;
Sprite_SkitOverlay.prototype.zOrder = function(){
	if(this._exPartsKind==='costume'){
		var type = $gameSkit.costumeTypeSetting(this._exPartsSubType);
		return type ? (type.priority||0) : 0;
	}else{
		return _Sprite_SkitOverlay_zOrder.call(this);
	}
};

Sprite_SkitOverlay.isTypeCostume = function(partsId){
	return typeof partsId==='string' &&  partsId.indexOf('COS:')===0;
};
Sprite_SkitOverlay.costumeType = function(partsId){
	return partsId.replace('COS:','').split('_')[0];
};

var _Sprite_SkitOverlay_isTypeSame = Sprite_SkitOverlay.prototype.isTypeSame;
Sprite_SkitOverlay.prototype.isTypeSame = function(partsKind,partsId){
	if(Sprite_SkitOverlay.isTypeCostume(partsId)){
		if(this._exPartsKind !== 'costume')return false;
		if(Sprite_SkitOverlay.costumeType(partsId)!==this._exPartsSubType){
			return false;
		}
		return true;
	}else{
		return _Sprite_SkitOverlay_isTypeSame.call(this,partsKind,partsId);
	}
};


var _Sprite_SkitOverlay_loadBitmapForMultiLayer = Sprite_SkitOverlay.prototype.loadBitmapForMultiLayer;
Sprite_SkitOverlay.prototype.loadBitmapForMultiLayer = function(useSpritesheets,actorName,poseName,partsKind,partsId){
	if(this._exPartsKind === 'costume'){
		this._loadBitmapForCostume(actorName,poseName,partsId);
	}else{
		_Sprite_SkitOverlay_loadBitmapForMultiLayer.call(this,useSpritesheets,actorName,poseName,partsKind,partsId);
	}
};


Sprite_SkitOverlay.prototype._loadBitmapForCostume = function(actorName,poseName,partsId){
	var imageName = 'costume_' + partsId + '_' + poseName;

	var typeName = this._exPartsSubType;
	var typeSetting = $gameSkit.costumeTypeSetting(typeName);
	var sheetSetting = typeSetting.spritesheet;
	if(sheetSetting>0){
		imageName += '.png';

  		var file = actorName+'_costume_'+typeName;
  		if(sheetSetting===1){
  			//all packing
  		}else{
  			//all packing
  			file += '_'+poseName;
  		}

  		this.bitmap = ImageManager.loadBust(actorName,file);
  		this.setupWithSheet(file,imageName);
  	}else{
  		this.bitmap = ImageManager.loadBust(actorName,imageName);
  	}
};



/* apply Costume
===================================*/
var _SkitActor_applyPose = SkitActor.prototype.applyPose;
SkitActor.prototype.applyPose = function(pose){
	this.setupCostume();
	_SkitActor_applyPose.call(this,pose);
};





Skit.COMMAND_COSTUME_J1 = '衣装';
Skit.COMMAND_COSTUME_J2 = 'コスチューム';
})();

