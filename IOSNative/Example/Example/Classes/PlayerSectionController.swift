//
//  PlayerSectionController.swift
//  Example
//
//  Created by APPLE on 6/27/17.
//  Copyright © 2017 Viral. All rights reserved.
//

import UIKit
import IGListKit

final class PlayerSectionController: ListSectionController {
    var parent: UIViewController!
    private var info: String?
    var items = [PlayerItem]()
    override init() {
        super.init()
        self.inset = UIEdgeInsets(top: 0, left: 5, bottom: 0, right: 5)
    }
    
    override func sizeForItem(at index: Int) -> CGSize {
        if index == 0 {
            return CGSize(width: screenSize.width , height: 50)
        }
        let width = ((screenSize.width - 10) / 2)
        return CGSize(width: width, height: width)
    }
    
    override func cellForItem(at index: Int) -> UICollectionViewCell {
        if index == 0 {
            guard let cell = collectionContext?.dequeueReusableCell(of: LabelCell.self, for: self, at: index) as? LabelCell else {
                fatalError()
            }
            cell.text = info
            cell.contentView.backgroundColor = .clear
            cell.textColor = .black
            return cell
        }
        guard let nibCell = collectionContext?.dequeueReusableCell(withNibName: "PlayerItemCell",
                                                                   bundle: nil,
                                                                   for: self,
                                                                   at: index) as? PlayerItemCell else {
                                                                    fatalError()
        }
        let item = items[index - 1]
        nibCell.lblTitle.text = "\(item.givenName) \(item.familyName)"
        nibCell.lblDate.text = item.dateOfBirth
        nibCell.lblNationality.text = item.nationality
        return nibCell
    }
    override func numberOfItems() -> Int {
        return 1 + items.count
    }
    override func didUpdate(to object: Any) {
        info = object as? String
    }
}
