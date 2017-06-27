//
//  Season.swift
//  Example
//
//  Created by APPLE on 6/27/17.
//  Copyright © 2017 Viral. All rights reserved.
//

import Foundation
import IGListKit
import EVReflection

class SeasonMain: EVObject {
    var MRData = SeasonModel()
}
class SeasonModel: EVObject {
    var series = ""
    var xmlns = ""
    var url = ""
    var limit = ""
    var offset = ""
    var total = ""
    var SeasonTable = SeasonObject()
}
class SeasonObject: EVObject {
    var Seasons = [SeasonItem]()
}
class SeasonItem: EVObject {
    var season = ""
    var url = ""
}
extension SeasonItem: ListDiffable {
    
    func diffIdentifier() -> NSObjectProtocol {
        return season as NSObjectProtocol
    }
    
    func isEqual(toDiffableObject object: ListDiffable?) -> Bool {
        if self === object { return true }
        guard let object = object as? SeasonItem else { return false }
        return season == object.season
    }
    
}
