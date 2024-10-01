// AntiFormulaforNewGame.js Ver.2.0.0
// MIT License (C) 2020 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ MV
* @plugindesc ツクール恒例のお約束を排除します。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/
* @help ニューゲーム直後の向きを指定したり、フェードインをするかどうかを決められます。
* わざわざ何もないマップを作ったり、主人公を透明化させる必要性が無くなります。
* また、BGMなどのフェードアウトの有無を決められます。
* タイトルBGSの演奏にも対応しています。
*
* [更新履歴]
* 2020/11/10：Ver.1.0.0　リリース。
* 2020/11/10：Ver.1.0.1　MV/MZの判別方法を変更。
* 2022/06/26：Ver.2.0.0　不具合修正。競合対策。処理の共通化。タイトルBGSの追加。
*
* @param direction
* @text 向き
* @desc ニューゲーム時の向き。
* 下：2　左：4　右：6　上：8
* @default 2
* @type number
*
* @param fadeIn
* @text 画面のフェードイン
* @desc ニューゲーム時に真っ暗で始める場合はfalse。
* @default true
* @type boolean
*
* @param fadeOutBgm
* @text BGMのフェードアウト
* @desc ニューゲーム時にBGMのフェードアウトをさせない場合はfalse。
* @default true
* @type boolean
*
* @param fadeOutBgs
* @text BGSのフェードアウト
* @desc ニューゲーム時にBGSのフェードアウトをさせない場合はfalse。
* @default true
* @type boolean
*
* @param fadeOutMe
* @text MEのフェードアウト
* @desc ニューゲーム時にMEのフェードアウトをさせない場合はfalse。
* @default true
* @type boolean
*
* @param titleBgs
* @text タイトルBGS
* @desc タイトル画面で使用するBGSを選択します。
* @type struct<bgs>
*
*/

/*~struct~bgs:
*
* @param name
* @text ファイル名
* @type file
* @dir audio/bgs
*
* @param volume
* @text 音量
* @type number
* @default 90
*
* @param pitch
* @text ピッチ
* @type number
* @default 100
*
* @param pan
* @text 位相
* @type number
* @min -100
* @default 0
*
*/
 
'use strict';
{

	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const parameters = PluginManager.parameters(pluginName);

	const analyzeAudio = parameter => {
		if (!parameter) return null;
		const params = JSON.parse(parameter);
		if (!params.name) return null;
		for (const param in params) {
			if (param !== "name") {
				params[param] = parseInt(params[param]);
			}
		}
		return params;
	};

	const titleBgs = analyzeAudio(parameters["titleBgs"]);
	const direction = Number(parameters["direction"]);
	const fadeIn = parameters["fadeIn"] === 'true';
	const bgm = parameters["fadeOutBgm"] === 'true';
	const bgs = parameters["fadeOutBgs"] === 'true';
	const me = parameters["fadeOutMe"] === 'true';

	const _DataManager_setupNewGame = DataManager.setupNewGame;
	DataManager.setupNewGame = function() {
		_DataManager_setupNewGame.call(this);
		$gamePlayer._newDirection = direction;
	};

	const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
	Scene_Title.prototype.commandNewGame = function() {
		_Scene_Title_commandNewGame.call(this);
		if(!fadeIn) $gameScreen.startFadeOut(1);
	};

	Scene_Title.prototype.fadeOutAll = function() {
		const time = this.slowFadeSpeed() / 60;
		if(bgm) AudioManager.fadeOutBgm(time);
		if(bgs) AudioManager.fadeOutBgs(time);
		if(me) AudioManager.fadeOutMe(time);
		this.startFadeOut(this.slowFadeSpeed());
	};

	const _Scene_Title_playTitleMusic = Scene_Title.prototype.playTitleMusic;
	Scene_Title.prototype.playTitleMusic = function() {
		_Scene_Title_playTitleMusic.call(this);
		if (titleBgs) AudioManager.playBgs(titleBgs);
	};
	
}