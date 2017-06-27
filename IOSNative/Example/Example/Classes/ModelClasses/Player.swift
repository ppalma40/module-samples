//
//  Player.swift
//  Example
//
//  Created by APPLE on 6/27/17.
//  Copyright © 2017 Viral. All rights reserved.
//

import Foundation
import IGListKit
import EVReflection

class PlayerMain: EVObject {
    var MRData = PlayerModel()
}
class PlayerModel: EVObject {
    var series = ""
    var xmlns = ""
    var url = ""
    var limit = ""
    var offset = ""
    var total = ""
    var DriverTable = PlayerObject()
}
class PlayerObject: EVObject {
    var season = ""
    var Drivers = [PlayerItem]()
}
class PlayerItem: EVObject {
    var driverId = ""
    var code = ""
    var givenName = ""
    var familyName = ""
    var dateOfBirth = ""
    var nationality = ""
    var url = ""
}
extension PlayerItem: ListDiffable {
    
    func diffIdentifier() -> NSObjectProtocol {
        return driverId as NSObjectProtocol
    }
    
    func isEqual(toDiffableObject object: ListDiffable?) -> Bool {
        if self === object { return true }
        guard let object = object as? PlayerItem else { return false }
        return driverId == object.driverId
    }
    
}
