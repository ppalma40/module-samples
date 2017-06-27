//
//  WebServices+Extension.swift
//  Example
//
//  Created by APPLE on 6/27/17.
//  Copyright © 2017 Viral. All rights reserved.
//

import Foundation
import Alamofire
import EVReflection
import AlamofireJsonToObjects
import IGListKit
import SVProgressHUD

extension ViewController {
    func callWebserviceSeason() {
        SVProgressHUD.show()
        Alamofire.request(baseURL + URLS.seasons.rawValue).responseObject { [unowned self](response: DataResponse<SeasonMain>) in
            SVProgressHUD.dismiss()
            if let arr = response.result.value?.MRData.SeasonTable.Seasons {
                DispatchQueue.main.async {
                    self.data = arr.reversed()
                }
            }
            else {
                print(PopupMessage.internetError)
            }
        }
    }
}

extension PlayerListViewController {
    func callWebserviceSeasonPlayers() {
        SVProgressHUD.show()
        let url = String(format: baseURL + URLS.playerList.rawValue, self.object!.season)
        Alamofire.request(url).responseObject { [unowned self](response: DataResponse<PlayerMain>) in
            SVProgressHUD.dismiss()
            if let arr = response.result.value?.MRData.DriverTable.Drivers {
                DispatchQueue.main.async {
                    self.data = arr
                }
            }
            else {
                print(PopupMessage.internetError)
            }
        }
    }
}
