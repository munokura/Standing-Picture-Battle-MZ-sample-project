//=============================================================================
// RPGツクールMZ - LL_StandingPictureBattle.js v1.0.1
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// Licensed under The MIT License
// https://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 戦闘中に立ち絵を自動表示します。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin
 *
 * @help LL_StandingPictureBattle.js
 *
 * 戦闘中、下記のタイミングで立ち絵を自動表示します。
 *   ・コマンド選択時 (ピンチ時に画像を切替可能)
 *   ・被ダメージ時
 *   ・勝利時
 *
 * ※画像を反転させたい場合
 *   X拡大率に「-100」と入力すると画像が反転します。
 *   (原点を左上にしている場合、X座標が画像横幅分左にずれます)
 *
 * プラグインコマンド:
 *   立ち絵表示ON・OFF: 立ち絵の表示・非表示を一括制御します。
 *
 * 作者: ルルの教会
 * 作成日: 2020/10/6
 *
 * このプラグインはMITライセンスで配布します。
 * https://opensource.org/licenses/mit-license.php
 *
 * @command setEnabled
 * @text 立ち絵表示ON・OFF
 * @desc 立ち絵の表示・非表示を一括制御します。
 *
 * @arg enabled
 * @text 立ち絵表示
 * @desc OFFにすると立ち絵が表示されなくなります。
 * @default true
 * @type boolean
 *
 * @param sbCommandPictures
 * @text 立ち絵リスト (コマンド)
 * @desc コマンド選択中に表示する立ち絵を定義します。
 * （1アクター1枚で設定、設定なしの場合は非表示になります）
 * @default []
 * @type struct<sbCommandPictures>[]
 *
 * @param sbDamagePictures
 * @text 立ち絵リスト (ダメージ)
 * @desc ダメージ時に表示する立ち絵を定義します。
 * （1アクター1枚、設定しなかった場合は非表示になります）
 * @default []
 * @type struct<sbDamagePictures>[]
 *
 * @param sbWinPictures
 * @text 立ち絵リスト (勝利)
 * @desc 戦闘勝利時に表示する立ち絵を定義します。
 * （1アクター1枚、設定しなかった場合は非表示になります）
 * @default []
 * @type struct<sbPictureMotions>[]
 *
 * @param winActorType
 * @text 勝利時の表示アクター
 * @desc 勝利時に表示されるアクターを選択してください。
 * @type select
 * @default lastActor
 * @option 最後に行動したアクター
 * @value lastActor
 * @option 先頭のアクター
 * @value firstActor
 * @option ランダム
 * @value randomActor
 */

/*~struct~sbCommandPictures:
 *
 * @param actorId
 * @text アクターID
 * @desc アクターIDです。立ち絵を定義するアクターを選択してください。
 * @type actor
 *
 * @param imageName
 * @text 画像ファイル名
 * @desc 立ち絵として表示する画像ファイルを選択してください。
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param origin
 * @text 原点
 * @desc 立ち絵の原点です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param x
 * @text X座標
 * @desc 立ち絵の表示位置(X)です。
 * @default 464
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y
 * @text Y座標
 * @desc 立ち絵の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleX
 * @text X拡大率
 * @desc 立ち絵の拡大率(X)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y拡大率
 * @desc 立ち絵の拡大率(Y)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param motion
 * @text モーション
 * @desc 再生モーションを選択してください。
 * @default floatrightfast
 * @type select
 * @option なし
 * @value none
 * @option 右からフロートイン
 * @value floatrightfast
 * @option 左からフロートイン
 * @value floatleftfast
 * @option 頷く
 * @value yes
 * @option ジャンプ
 * @value jump
 * @option 繰り返しジャンプ
 * @value jumploop
 * @option 横に揺れ続ける
 * @value noslowloop
 * @option 息づかい風
 * @value breathing
 *
 * @param pinchPercentage
 * @text ピンチしきい値
 * @desc ピンチのしきい値をHP％で指定してください。
 * 無効にしたい場合は0を入力してください。
 * @default 25
 * @type number
 * @min 0
 * @max 100
 *
 * @param pinchImageName
 * @text 画像ファイル名
 * @desc ピンチ時に表示する画像ファイルを選択してください。
 * 設定しなかった場合は通常と同じ画像が表示されます。
 * @dir img/pictures
 * @type file
 * @require 1
 * @parent pinchPercentage
 *
 * @param pinchMotion
 * @text モーション
 * @desc ピンチ時の再生モーションを選択してください。
 * @default floatrightfast
 * @type select
 * @option なし
 * @value none
 * @option 右からフロートイン
 * @value floatrightfast
 * @option 左からフロートイン
 * @value floatleftfast
 * @option 頷く
 * @value yes
 * @option ジャンプ
 * @value jump
 * @option 繰り返しジャンプ
 * @value jumploop
 * @option 横に揺れ続ける
 * @value noslowloop
 * @option 息づかい風
 * @value breathing
 * @parent pinchPercentage
 */

/*~struct~sbDamagePictures:
 *
 * @param actorId
 * @text アクターID
 * @desc アクターIDです。立ち絵を定義するアクターを選択してください。
 * @type actor
 *
 * @param imageName
 * @text 画像ファイル名
 * @desc 立ち絵として表示する画像ファイルを選択してください。
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param origin
 * @text 原点
 * @desc 立ち絵の原点です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param x
 * @text X座標
 * @desc 立ち絵の表示位置(X)です。
 * @default 464
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y
 * @text Y座標
 * @desc 立ち絵の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleX
 * @text X拡大率
 * @desc 立ち絵の拡大率(X)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y拡大率
 * @desc 立ち絵の拡大率(Y)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param motion
 * @text モーション
 * @desc 再生モーションを選択してください。
 * @default damage
 * @type select
 * @option なし
 * @value none
 * @option 揺れる
 * @value damage
 */

/*~struct~sbPictureMotions:
 *
 * @param actorId
 * @text アクターID
 * @desc アクターIDです。立ち絵を定義するアクターを選択してください。
 * @type actor
 *
 * @param imageName
 * @text 画像ファイル名
 * @desc 立ち絵として表示する画像ファイルを選択してください。
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param origin
 * @text 原点
 * @desc 立ち絵の原点です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param x
 * @text X座標
 * @desc 立ち絵の表示位置(X)です。
 * @default 464
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y
 * @text Y座標
 * @desc 立ち絵の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleX
 * @text X拡大率
 * @desc 立ち絵の拡大率(X)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y拡大率
 * @desc 立ち絵の拡大率(Y)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param motion
 * @text モーション
 * @desc 再生モーションを選択してください。
 * @default floatRight
 * @type select
 * @option なし
 * @value none
 * @option 右からフロートイン
 * @value floatright
 * @option 左からフロートイン
 * @value floatleft
 * @option 頷く
 * @value yes
 * @option ジャンプ
 * @value jump
 * @option 繰り返しジャンプ
 * @value jumploop
 */

(() => {
	"use strict";
	const pluginName = "LL_StandingPictureBattle";

	const parameters = PluginManager.parameters(pluginName);
	const sbCommandPictures = JSON.parse(parameters["sbCommandPictures"] || "null");
	const sbDamagePictures = JSON.parse(parameters["sbDamagePictures"] || "null");
	const sbWinPictures = JSON.parse(parameters["sbWinPictures"] || "null");
	const winActorType = String(parameters["winActorType"] || "lastActor");

	let sbCommandPictureLists = [];
	if (sbCommandPictures) {
		sbCommandPictures.forEach((elm) => {
			sbCommandPictureLists.push(JSON.parse(elm || "null"));
		});
	}
	let sbDamagePictureLists = [];
	if (sbDamagePictures) {
		sbDamagePictures.forEach((elm) => {
			sbDamagePictureLists.push(JSON.parse(elm || "null"));
		});
	}
	let sbWinPictureLists = [];
	if (sbWinPictures) {
		sbWinPictures.forEach((elm) => {
			sbWinPictureLists.push(JSON.parse(elm || "null"));
		});
	}

	// Plugin Command
	PluginManager.registerCommand(pluginName, "setEnabled", args => {
		const enabled = eval(args.enabled || "true");
		$gameSystem._StandingPictureBattleDisabled = !enabled;
	});

	// 独自変数定義
	let animationCount = 0;
	let refSbPicture = false;
	let motionSbPicture = "";
	let showDamageActorId = null;
	let activeCommandActorId = null;
	let activeDamageActorId = null;

	// アニメーションフレーム数定義
	const animationFrame = {
		"yes":            24,
		"yesyes":         48,
		"no":             24,
		"noslow":         48,
		"jump":           24,
		"jumpjump":       48,
		"jumploop":       48,
		"shake":          1,
		"shakeloop":      1,
		"runleft":        1,
		"runright":       1,
		"damage":         1,
		"floatrightfast": 12,
		"floatright":     48,
		"floatleftfast":  12,
		"floatleft":      48,
		"noslowloop":     96,
		"breathing":      96,
		"none":           0
	};

	// 画像ファイル名を取得
	const getImageName = (actorId, pictureLists) => {
		let sbPicture = pictureLists.find(function(item, index) {
			if (Number(item.actorId) == actorId) return true;
		});
		return sbPicture;
	};

	// Battle Managerを拡張
	BattleManager.isPhase = function() {
		return this._phase;
	};

	// Game Partyを拡張
	Game_Party.prototype.aliveBattleMembers = function() {
		return this.allMembers()
			.slice(0, this.maxBattleMembers())
			.filter(actor => actor.isAppeared())
			.filter(actor => actor.isAlive());
	};
	Game_Party.prototype.firstBattleMember = function() {
		return this.allMembers()
			.slice(0, 1)
			.filter(actor => actor.isAppeared());
	};
	Game_Party.prototype.randomBattleMenber = function() {
		let r = Math.randomInt(this.maxBattleMembers());
		return this.allMembers()
			.slice(r, r + 1)
			.filter(actor => actor.isAppeared());
	};

	const _Game_Battler_performDamage = Game_Battler.prototype.performDamage;
	Game_Battler.prototype.performDamage = function() {
		_Game_Battler_performDamage.apply(this, arguments);
		// ダメージを受けたアクターIDを取得
		showDamageActorId = this._actorId;
	};

	//-----------------------------------------------------------------------------
	// Ex Standing Picture Battle class
	//
	// 戦闘中立ち絵を表示する独自のクラスを追加定義します。

	class ExStandingPictureBattle {

		static create (elm) {
			// 立ち絵1
			elm._spbSprite = new Sprite();
			elm._spbSprite.bitmap = null;
			elm._spbSprite.opacity = 255;
			elm._spbSprite.opening = false;
			elm._spbSprite.closing = false;
			elm._spbSprite.showing = false;
			elm.addChild(elm._spbSprite);
			// バトル終了フラグをオフ
			this._battleEnd = false;
			// ランダムアクターIDを定義
			//this._randomActorId = null;
		}

		static update (elm) {
			// 立ち絵を非表示に設定している場合、処理を中断
			if ($gameSystem._StandingPictureBattleDisabled) {
				elm._spbSprite.opacity = 0;
				return;
			}

			// 初期設定
			let sbPicture = null;
			let isPhase = BattleManager.isPhase();
			let isEscaped = BattleManager.isEscaped();
			let isAllDead = $gameParty.isAllDead();
			let commandActor = BattleManager.actor();
			if (BattleManager._action) {
				if (BattleManager._action._subjectActorId) {
					this._lastActionActorId = BattleManager._action._subjectActorId;
				}
			}

			//-----------------------------------------------------------------------------
			// 戦闘終了時
			//-----------------------------------------------------------------------------
			if (isPhase == "battleEnd") {
				if (isEscaped) {
					// 逃走
				} else if (isAllDead) {
					// 全滅
				} else {
					if (!this._battleEnd) {
						// 生存しているアクターを取得
						let aliveBattleMembers = $gameParty.aliveBattleMembers();
						// 先頭アクターIDを取得
						this._firstActorId = aliveBattleMembers.length > 0 ? aliveBattleMembers[0]._actorId : null;
						// ランダムアクターID抽選
						this._randomActorId = aliveBattleMembers.length > 0 ? aliveBattleMembers[Math.floor(Math.random() * aliveBattleMembers.length)]._actorId : null;
					}
					if (winActorType == "lastActor") {
						sbPicture = getImageName(this._lastActionActorId, sbWinPictureLists);
						//console.log(this._lastActionActorId);
					} else if (winActorType == "randomActor") {
						sbPicture = getImageName(this._randomActorId, sbWinPictureLists);
						//console.log(this._randomActorId);
					} else {
						sbPicture = getImageName(this._firstActorId, sbWinPictureLists);
						//console.log(this._firstActorId);
					}
					if (!this._battleEnd) {
						if (sbPicture) {
							refSbPicture = true;
							motionSbPicture = sbPicture.motion;
							animationCount = animationFrame[motionSbPicture];
							elm._spbSprite.opacity = 0;
						}
					}
				}
				this._battleEnd = true;
			}
			//-----------------------------------------------------------------------------
			// 被ダメージ時
			//-----------------------------------------------------------------------------
			if (showDamageActorId) {
				if (isPhase == "action") {
					sbPicture = getImageName(showDamageActorId, sbDamagePictureLists);
					if (sbPicture) {
						if (activeDamageActorId != showDamageActorId) {
							activeDamageActorId = showDamageActorId;
							refSbPicture = true;
							motionSbPicture = sbPicture.motion;
							animationCount = animationFrame[motionSbPicture];
							elm._spbSprite.opacity = 0;
						}
					}
				} else {
					showDamageActorId = null;
					sbPicture = null;
				}
			}
			//-----------------------------------------------------------------------------
			// 戦う or 逃げる 選択時
			//-----------------------------------------------------------------------------
			if (isPhase == "input" && !commandActor) {
				//
			}
			//-----------------------------------------------------------------------------
			// コマンド入力時
			//-----------------------------------------------------------------------------
			if (isPhase == "turn" || isPhase == "input") {
				if (commandActor) {
					sbPicture = getImageName(commandActor._actorId, sbCommandPictureLists);
					// HPレートを取得
					let hpRate = commandActor.mhp > 0 ? commandActor.hp / commandActor.mhp * 100 : 0;
					if (sbPicture) {
						sbPicture = JSON.parse(JSON.stringify(sbPicture));
						if (activeCommandActorId != commandActor._actorId) {
							activeCommandActorId = commandActor._actorId;
							refSbPicture = true;
							// ピンチ判定
							if (hpRate > Number(sbPicture.pinchPercentage)) {
								// 通常
								motionSbPicture = sbPicture.motion;
								animationCount = animationFrame[motionSbPicture];
							} else {
								// ピンチ
								if (sbPicture.pinchImageName) sbPicture.imageName = sbPicture.pinchImageName;
								motionSbPicture = sbPicture.pinchMotion;
								animationCount = animationFrame[motionSbPicture];
							}
							elm._spbSprite.opacity = 0;
						}
					}
				}
			}

			// 立ち絵ピクチャ作成
			if (sbPicture && refSbPicture) {
				this.refresh(elm._spbSprite, sbPicture);
				refSbPicture = false;
			}

			// フェード処理
			if (sbPicture) {
				this.fadeIn(elm._spbSprite, sbPicture);
			} else {
				this.fadeOut(elm._spbSprite, sbPicture);
			}

			// 立ち絵モーション再生
			if (animationCount > 0) {
				animationCount = this.animation(elm._spbSprite, motionSbPicture, animationCount);
			}

			//console.log("[1] x:" + elm._spbSprite.x + " y:" + elm._spbSprite.y + " opacity:" + elm._spbSprite.opacity + " motion: " + motionSbPicture + " opening: " + elm._spbSprite.opening + " closing: " + elm._spbSprite.closing + " scaleX: " + elm._spbSprite.scale.x + " scaleY: " + elm._spbSprite.scale.y);
		}

		static refresh (sSprite, sPicture) {
			sSprite.bitmap = null;
			sSprite.bitmap = ImageManager.loadPicture(sPicture.imageName);
			sSprite.showing = false;
			let calcScaleX = Number(sPicture.scaleX);
			let calcScaleY = Number(sPicture.scaleY);
			// 画像が読み込まれたあとに実行
			sSprite.bitmap.addLoadListener(function() {
				if (Number(sPicture.origin) == 0) {
					// 左上原点
					sSprite.x = Number(sPicture.x);
					sSprite.y = Number(sPicture.y);
					sSprite.originX = Number(sPicture.x);
					sSprite.originY = Number(sPicture.y);
				} else {
					// 中央原点
					sSprite.x = Number(sPicture.x) - (sSprite.width * calcScaleX / 100) / 2;
					sSprite.y = Number(sPicture.y) - (sSprite.height * calcScaleY / 100) / 2;
					sSprite.originX = Number(sPicture.x) - (sSprite.width * calcScaleX / 100) / 2;
					sSprite.originY = Number(sPicture.y) - (sSprite.height * calcScaleY / 100) / 2;
				}
				// 切替効果
				if (sSprite.opacity == 0) {
					//
				}
				sSprite.scale.x = calcScaleX / 100;
				sSprite.scale.y = calcScaleY / 100;
				sSprite.showing = true;
			}.bind(this));
		}

		static fadeIn (sSprite, sPicture) {
			if (!sSprite.showing) return;
			if (sSprite.opacity >= 255) {
				sSprite.opening = false;
				sSprite.opacity = 255;
				return;
			}
			sSprite.opening = true;
			sSprite.closing = false;
			sSprite.opacity += 24;
		}

		static fadeOut (sSprite, sPicture) {
			if (sSprite.opacity == 0) {
				activeCommandActorId = null;
				activeDamageActorId = null;
				sSprite.closing = false;
				return;
			}
			sSprite.closing = true;
			if (!sPicture) {
				//sSprite.opacity = 0;
				//return;
			}
			sSprite.opacity -= 24;
		}

		static animation (sSprite, sMotion, animationCount) {
			if (!sSprite.showing) return animationCount;
			if (sMotion == "yes") {
				if (animationCount > 12) {
					sSprite.y += 2;
				} else {
					sSprite.y -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "yesyes") {
				if (animationCount > 36) {
					sSprite.y += 2;
				} else if (animationCount > 24) {
					sSprite.y -= 2;
				} else if (animationCount > 12) {
					sSprite.y += 2;
				} else {
					sSprite.y -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "no") {
				if (animationCount > 18) {
					sSprite.x += 2;
				} else if (animationCount > 6) {
					sSprite.x -= 2;
				} else {
					sSprite.x += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "noslow") {
				if (animationCount > 36) {
					sSprite.x += 1;
				} else if (animationCount > 12) {
					sSprite.x -= 1;
				} else {
					sSprite.x += 1;
				}
				animationCount -= 1;
			}
			if (sMotion == "jump") {
				if (animationCount > 12) {
					sSprite.y -= 2;
				} else {
					sSprite.y += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "jumpjump") {
				if (animationCount > 36) {
					sSprite.y -= 2;
				} else if (animationCount > 24) {
					sSprite.y += 2;
				} else if (animationCount > 12) {
					sSprite.y -= 2;
				} else {
					sSprite.y += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "jumploop") {
				if (animationCount > 36) {
					sSprite.y -= 2;
				} else if (animationCount > 24) {
					sSprite.y += 2;
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = animationFrame["jumploop"];
			}
			if (sMotion == "shake") {
				if (animationCount <= 2) {
					sSprite.x -= 2;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 2;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 4;
					sSprite.y += 4;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 2;
					animationCount += 1;
				} else if (animationCount == 9) {
					sSprite.x -= 2;
					animationCount += 1;
				} else if (animationCount == 10) {
					sSprite.x -= 2;
					animationCount = 0;
				}
			}
			if (sMotion == "shakeloop") {
				if (animationCount <= 2) {
					sSprite.x -= 1;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 1;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 2;
					sSprite.y += 2;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 1;
					animationCount += 1;
				} else if (animationCount <= 10) {
					sSprite.x -= 1;
					animationCount += 1;
				}
				if (animationCount > 10) animationCount = 1;
			}
			if (sMotion == "runleft") {
				sSprite.x -= 16;
				if (sSprite.x < -2000) animationCount = 0;
			}
			if (sMotion == "runright") {
				sSprite.x += 16;
				if (sSprite.x > 2000) animationCount = 0;
			}
			//
			if (sMotion == "damage") {
				if (animationCount <= 2) {
					sSprite.x -= 4;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 4;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 8;
					sSprite.y += 8;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 4;
					animationCount += 1;
				} else if (animationCount == 9) {
					sSprite.x -= 4;
					animationCount += 1;
				} else if (animationCount == 10) {
					sSprite.x -= 4;
					animationCount = 0;
				}
			}
			if (sMotion == "floatrightfast") {
				if (animationCount == 12) {
					sSprite.x += 22;
				} else {
					sSprite.x -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "floatright") {
				if (animationCount == 48) {
					sSprite.x += 47;
				} else {
					sSprite.x -= 1;
				}
				animationCount -= 1;
			}
			if (sMotion == "floatleftfast") {
				if (animationCount == 12) {
					sSprite.x -= 22;
				} else {
					sSprite.x += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "floatleft") {
				if (animationCount == 48) {
					sSprite.x -= 47;
				} else {
					sSprite.x += 1;
				}
				animationCount -= 1;
			}
			if (sMotion == "noslowloop") {
				if (animationCount > 72) {
					sSprite.x += 0.25;
				} else if (animationCount > 24) {
					sSprite.x -= 0.25;
				} else {
					sSprite.x += 0.25;
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = animationFrame["noslowloop"];
			}
			if (sMotion == "breathing") {
				if (animationCount > 72) {
					sSprite.y += 0.5;
				} else if (animationCount > 48) {
					sSprite.y -= 0.5;
				} else {
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = animationFrame["breathing"];
			}
			return animationCount;
		}
	}

	const _Scene_Battle_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		_Scene_Battle_update.apply(this, arguments);
		ExStandingPictureBattle.update(this);
	};

	const _Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
	Scene_Battle.prototype.createSpriteset = function() {
		_Scene_Battle_createSpriteset.apply(this, arguments);
		ExStandingPictureBattle.create(this);
	};
})();
