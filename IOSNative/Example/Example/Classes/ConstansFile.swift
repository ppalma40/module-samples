//
//  ConstansFile.swift
//  Example
//
//  Created by APPLE on 5/16/17.
//  Copyright © 2017 viral. All rights reserved.
//

import Foundation
import UIKit


//MARK: - Variable declaration -
let baseURL = "http://ergast.com/api/f1/"
let appDelegate = UIApplication.shared.delegate as! AppDelegate
let screenSize = UIScreen.main.bounds.size
let mainBoard = UIStoryboard(name: "Main", bundle: nil)
//MARK: - URLS enum -
enum URLS: String {
    case seasons = "seasons.json?limit=1000"
    case playerList = "%@/drivers.json?limit=1000"
}
//MARK: - Popup messages enum -
enum PopupMessage: String {
    case internetError = "oops, something went wrong, please try again later"
}
func convertToDictionary(text: String) -> [String: Any]? {
    if let data = text.data(using: .utf8) {
        do {
            return try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
        } catch {
            print(error.localizedDescription)
        }
    }
    return nil
}
