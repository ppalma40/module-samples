//
//  Extension.swift
//  Example
//
//  Created by APPLE on 5/17/17.
//  Copyright © 2017 viral. All rights reserved.
//

import Foundation
import UIKit
import SDWebImage

//MARK: String extension
extension String {
    func localized() -> String {
        return NSLocalizedString(self, tableName: "Localizable", bundle: .main, value: self, comment: "")
    }
    var intValue: Int {
        return Int(self) ?? 0
    }
    var length: Int {
        return self.characters.count
    }
    var trim: String {
        return self.trimmingCharacters(in: NSCharacterSet.whitespaces)
    }
    func toDate(_ format: String) -> Date? {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = format
        dateFormatter.timeZone = TimeZone(identifier: "UTC")!
        return dateFormatter.date(from: self)
    }
    var removeTimeZoneStamp: String {
        if self.components(separatedBy: "+").count > 1 {
            return self.components(separatedBy: "+").first!
        }
        else if self.components(separatedBy: "-").count > 1 {
            return self.components(separatedBy: "-").first!
        }
        return self
    }
    func heightWithConstrainedWidth(font: UIFont, width: CGFloat) -> CGFloat {
        let constraintRect = CGSize(width: width, height: CGFloat.greatestFiniteMagnitude)
        let boundingBox = self.boundingRect(with: constraintRect, options: NSStringDrawingOptions.usesLineFragmentOrigin, attributes: [NSFontAttributeName: font], context: nil)
        return boundingBox.height
    }
}

//MARK: UIImageView extension
extension UIImageView {
    func sd_setImageUrl(with url: String, isPlaceholder: Bool = true, placeholder: UIImage = #imageLiteral(resourceName: "placeholder")) {
        if isPlaceholder {
            self.sd_setImage(with: URL(string: url)!, placeholderImage: placeholder)
        }
        else {
            self.sd_setImage(with: URL(string: url)!)
        }
        self.sd_setShowActivityIndicatorView(true)
        self.sd_setIndicatorStyle(.gray)
    }
}

//MARK: Date extension
extension Date {
    func toString(_ format: String) -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = format
        dateFormatter.timeZone = TimeZone.current
        return dateFormatter.string(from: self)
    }
}

//MARK: UITextField extension
extension UITextField{
    func isvalidPassword(Textstring: String)-> String{
        if Textstring.characters.count != 0 {
            return Textstring
        }
        return "False"
    }
    func isValidEmail(testStr:String) -> Bool {
        print("validate emilId: \(testStr)")
        let emailRegEx = "^(?:(?:(?:(?: )*(?:(?:(?:\\t| )*\\r\\n)?(?:\\t| )+))+(?: )*)|(?: )+)?(?:(?:(?:[-A-Za-z0-9!#$%&’*+/=?^_'{|}~]+(?:\\.[-A-Za-z0-9!#$%&’*+/=?^_'{|}~]+)*)|(?:\"(?:(?:(?:(?: )*(?:(?:[!#-Z^-~]|\\[|\\])|(?:\\\\(?:\\t|[ -~]))))+(?: )*)|(?: )+)\"))(?:@)(?:(?:(?:[A-Za-z0-9](?:[-A-Za-z0-9]{0,61}[A-Za-z0-9])?)(?:\\.[A-Za-z0-9](?:[-A-Za-z0-9]{0,61}[A-Za-z0-9])?)*)|(?:\\[(?:(?:(?:(?:(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5]))\\.){3}(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5]))))|(?:(?:(?: )*[!-Z^-~])*(?: )*)|(?:[Vv][0-9A-Fa-f]+\\.[-A-Za-z0-9._~!$&'()*+,;=:]+))\\])))(?:(?:(?:(?: )*(?:(?:(?:\\t| )*\\r\\n)?(?:\\t| )+))+(?: )*)|(?: )+)?$"
        let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        let result = emailTest.evaluate(with: testStr)
        return result
    }

}
